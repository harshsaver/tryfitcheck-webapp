import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getFashnClient } from '@/lib/fashn/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Prediction ID is required' },
        { status: 400 }
      );
    }

    // Get generation record from database
    const supabase = createServiceRoleClient();
    const { data: generation, error: fetchError } = await supabase
      .from('web_tryon_generations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    // If already completed or failed, return from database
    if (generation.status === 'completed' || generation.status === 'failed') {
      return NextResponse.json({
        id: generation.id,
        status: generation.status,
        output: generation.output_image_url ? [generation.output_image_url] : undefined,
        error: generation.error_message ? {
          name: 'GenerationError',
          message: generation.error_message,
        } : undefined,
        createdAt: generation.created_at,
        completedAt: generation.completed_at,
      });
    }

    // Check status from AI provider
    if (generation.ai_provider === 'fashn') {
      const fashnClient = getFashnClient();
      const status = await fashnClient.getPredictionStatus(id);

      // Update database with new status
      if (status.status === 'completed') {
        await supabase
          .from('web_tryon_generations')
          .update({
            status: 'completed',
            output_image_url: status.output?.[0] || null,
            completed_at: new Date().toISOString(),
          })
          .eq('id', id);

        return NextResponse.json({
          id: status.id,
          status: 'completed',
          output: status.output,
          createdAt: generation.created_at,
          completedAt: new Date().toISOString(),
        });
      } else if (status.status === 'failed') {
        await supabase
          .from('web_tryon_generations')
          .update({
            status: 'failed',
            error_message: status.error?.message || 'Unknown error',
            completed_at: new Date().toISOString(),
          })
          .eq('id', id);

        return NextResponse.json({
          id: status.id,
          status: 'failed',
          error: status.error,
          createdAt: generation.created_at,
          completedAt: new Date().toISOString(),
        });
      }

      // Still processing
      return NextResponse.json({
        id: status.id,
        status: 'processing',
        createdAt: generation.created_at,
      });
    } else if (generation.ai_provider === 'google-nano') {
      // Google Nano status check (to be implemented)
      return NextResponse.json(
        { error: 'Google Nano Banana provider status check not yet implemented' },
        { status: 501 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown AI provider' },
      { status: 400 }
    );

  } catch (error) {
    console.error('[TryOn Status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check generation status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
