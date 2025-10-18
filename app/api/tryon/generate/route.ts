import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getFashnClient } from '@/lib/fashn/client';
import { processBase64Image, downloadImage, bufferToBase64 } from '@/lib/utils/image';
import type { TryOnRequest } from '@/types/tryon';

export async function POST(request: NextRequest) {
  try {
    const body: TryOnRequest = await request.json();
    const { modelImage, garmentImage, category = 'auto', mode = 'balanced', aiProvider = 'fashn', numSamples = 1 } = body;

    // Validate inputs
    if (!modelImage || !garmentImage) {
      return NextResponse.json(
        { error: 'Model image and garment image are required' },
        { status: 400 }
      );
    }

    // Get authenticated user (optional - allows anonymous usage with payment)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userId: string | null = null;
    let hasCredits = false;

    if (user) {
      userId = user.id;

      // Check if user has credits
      const supabaseAdmin = createServiceRoleClient();
      const { data: userData } = await supabaseAdmin
        .from('web_users')
        .select('credits')
        .eq('id', userId)
        .single();

      if (userData && userData.credits > 0) {
        hasCredits = true;
      } else {
        return NextResponse.json(
          { error: 'Insufficient credits. Please purchase credits to continue.' },
          { status: 402 } // Payment Required
        );
      }
    } else {
      // For anonymous users, they need to pay first
      return NextResponse.json(
        { error: 'Authentication required. Please sign in or purchase credits.' },
        { status: 401 }
      );
    }

    // Preprocess images if they are base64
    let processedModelImage = modelImage;
    let processedGarmentImage = garmentImage;

    if (modelImage.startsWith('data:image/')) {
      console.log('[TryOn] Processing model image...');
      processedModelImage = await processBase64Image(modelImage, { maxHeight: 2000, quality: 95 });
    } else if (modelImage.startsWith('http')) {
      // Optionally download and preprocess URL images
      console.log('[TryOn] Downloading and processing model image...');
      const buffer = await downloadImage(modelImage);
      const processedBuffer = await import('@/lib/utils/image').then(m => m.processImageBuffer(buffer, { maxHeight: 2000, quality: 95 }));
      processedModelImage = bufferToBase64(processedBuffer, 'image/jpeg');
    }

    if (garmentImage.startsWith('data:image/')) {
      console.log('[TryOn] Processing garment image...');
      processedGarmentImage = await processBase64Image(garmentImage, { maxHeight: 2000, quality: 95 });
    } else if (garmentImage.startsWith('http')) {
      console.log('[TryOn] Downloading and processing garment image...');
      const buffer = await downloadImage(garmentImage);
      const processedBuffer = await import('@/lib/utils/image').then(m => m.processImageBuffer(buffer, { maxHeight: 2000, quality: 95 }));
      processedGarmentImage = bufferToBase64(processedBuffer, 'image/jpeg');
    }

    // Call AI provider based on selection
    let predictionId: string;
    let predictionError: any = null;

    if (aiProvider === 'fashn') {
      // Use Fashn API
      const fashnClient = getFashnClient();
      const prediction = await fashnClient.createPrediction({
        modelImage: processedModelImage,
        garmentImage: processedGarmentImage,
        category,
        mode,
        numSamples,
        outputFormat: 'png',
        returnBase64: false, // Get CDN URLs instead
      });

      predictionId = prediction.id;
      predictionError = prediction.error;
    } else if (aiProvider === 'google-nano') {
      // Use Google Nano Banana API (to be implemented)
      return NextResponse.json(
        { error: 'Google Nano Banana provider is not yet implemented' },
        { status: 501 } // Not Implemented
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid AI provider' },
        { status: 400 }
      );
    }

    if (predictionError) {
      return NextResponse.json(
        { error: 'AI generation failed', details: predictionError },
        { status: 500 }
      );
    }

    // Store generation record in database
    const supabaseAdmin = createServiceRoleClient();
    const { error: insertError } = await supabaseAdmin
      .from('web_tryon_generations')
      .insert({
        id: predictionId,
        user_id: userId,
        model_image_url: typeof modelImage === 'string' && modelImage.startsWith('http') ? modelImage : 'base64',
        garment_image_url: typeof garmentImage === 'string' && garmentImage.startsWith('http') ? garmentImage : 'base64',
        category,
        mode,
        ai_provider: aiProvider,
        status: 'processing',
        credits_used: 1,
      });

    if (insertError) {
      console.error('[TryOn] Failed to store generation record:', insertError);
    }

    // Deduct credit from user
    if (hasCredits && userId) {
      const { error: updateError } = await supabaseAdmin
        .from('web_users')
        .update({
          credits: supabaseAdmin.rpc('decrement', { x: 1, row_id: userId }),
          total_generations: supabaseAdmin.rpc('increment', { x: 1, row_id: userId }),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('[TryOn] Failed to deduct credit:', updateError);
      }
    }

    return NextResponse.json({
      id: predictionId,
      status: 'processing',
      message: 'Virtual try-on generation started',
    });

  } catch (error) {
    console.error('[TryOn] Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate virtual try-on', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
