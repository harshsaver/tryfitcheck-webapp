import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/try-on';

  if (code) {
    try {
      const supabase = await createClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Auth callback error:', error);
      // Redirect to login with error if Supabase is not configured
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }
  }

  // Redirect to the next page or try-on page
  return NextResponse.redirect(new URL(next, request.url));
}
