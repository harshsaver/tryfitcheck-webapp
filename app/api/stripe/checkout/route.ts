import { NextRequest, NextResponse } from 'next/server';
import { stripe, getCreditPackage, type CreditPackageId } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId } = body as { packageId: CreditPackageId };

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }

    // Get package details
    const creditPackage = getCreditPackage(packageId);
    if (!creditPackage) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get base URL from request headers
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_APP_DOMAIN;

    // Get DataFast cookies for revenue attribution
    const cookieStore = await cookies();
    const datafast_visitor_id = cookieStore.get('datafast_visitor_id')?.value || '';
    const datafast_session_id = cookieStore.get('datafast_session_id')?.value || '';

    console.log('[Stripe Checkout] Creating session for user:', user.id);
    console.log('[Stripe Checkout] Package:', packageId, '|', creditPackage.credits, 'credits');
    console.log('[Stripe Checkout] DataFast visitor ID:', datafast_visitor_id ? 'present' : 'missing');

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment', // One-time payment, NOT subscription
      payment_method_types: ['card'],
      line_items: [
        {
          price: creditPackage.priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        user_email: user.email || '',
        package_id: packageId,
        package_name: creditPackage.name,
        credits_purchased: creditPackage.credits.toString(),
        // DataFast revenue attribution (CRITICAL for tracking)
        datafast_visitor_id,
        datafast_session_id,
      },
    });

    console.log('[Stripe Checkout] Session created:', session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error: any) {
    console.error('[Stripe Checkout] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
