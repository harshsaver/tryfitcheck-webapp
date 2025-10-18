import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getPackageByPriceId } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Validate price ID
    const creditPackage = getPackageByPriceId(priceId);
    if (!creditPackage) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Get authenticated user (optional for guest checkout)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get base URL from request headers (works on Vercel)
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_APP_DOMAIN;

    // Get DataFast cookies for revenue attribution
    const cookieStore = await cookies();
    const datafast_visitor_id = cookieStore.get('datafast_visitor_id')?.value || '';
    const datafast_session_id = cookieStore.get('datafast_session_id')?.value || '';

    console.log('[Stripe] Creating checkout session for package:', creditPackage.name);
    console.log('[Stripe] DataFast visitor ID:', datafast_visitor_id ? 'present' : 'missing');
    console.log('[Stripe] DataFast session ID:', datafast_session_id ? 'present' : 'missing');

    // Prepare metadata
    const metadata: Record<string, string> = {
      credits: creditPackage.credits.toString(),
      package_name: creditPackage.name,
      // DataFast revenue attribution cookies (CRITICAL for revenue tracking)
      datafast_visitor_id,
      datafast_session_id,
    };

    if (user) {
      metadata.user_id = user.id;
      metadata.user_email = user.email || '';
    }

    // Create Stripe Checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment', // One-time payment for credits
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/pricing?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?payment=cancelled`,
      metadata,
    };

    // Add customer email if user is logged in
    if (user?.email) {
      sessionConfig.customer_email = user.email;
    }

    // Add client_reference_id if user is logged in
    if (user) {
      sessionConfig.client_reference_id = user.id;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('[Stripe] Checkout session created:', session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
