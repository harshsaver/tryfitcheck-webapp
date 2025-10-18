import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

/**
 * GET /api/user/credits
 * Returns the current user's credit balance and total generations
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user credits
    const { data: userData, error: fetchError } = await supabase
      .from('web_users')
      .select('credits, total_generations')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      // User doesn't exist yet in web_users table
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({
          credits: 0,
          totalGenerations: 0,
        });
      }
      throw fetchError;
    }

    return NextResponse.json({
      credits: userData.credits || 0,
      totalGenerations: userData.total_generations || 0,
    });

  } catch (error) {
    console.error('[Credits] Error fetching user credits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/credits
 * Manually add credits to user (admin use or testing)
 */
export async function POST(request: Request) {
  try {
    const { userId, credits } = await request.json();

    if (!userId || !credits || credits <= 0) {
      return NextResponse.json(
        { error: 'User ID and positive credits amount required' },
        { status: 400 }
      );
    }

    // Use service role to bypass RLS
    const supabase = createServiceRoleClient();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('web_users')
      .select('id, credits')
      .eq('id', userId)
      .single();

    if (!existingUser) {
      // Get user email from auth
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);

      if (!authUser.user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Create new user record
      await supabase
        .from('web_users')
        .insert({
          id: userId,
          email: authUser.user.email || '',
          credits: credits,
          total_generations: 0,
        });

      return NextResponse.json({
        message: 'Credits added successfully',
        credits: credits,
      });
    }

    // Add credits to existing user
    const newCredits = existingUser.credits + credits;
    await supabase
      .from('web_users')
      .update({ credits: newCredits })
      .eq('id', userId);

    return NextResponse.json({
      message: 'Credits added successfully',
      credits: newCredits,
    });

  } catch (error) {
    console.error('[Credits] Error adding credits:', error);
    return NextResponse.json(
      { error: 'Failed to add credits', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
