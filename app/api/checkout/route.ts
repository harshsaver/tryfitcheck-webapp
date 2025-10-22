import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICING, PricingMode } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, personImageUrl, garmentImageUrl, category } = body;

    // Validate inputs
    if (!mode || !personImageUrl || !garmentImageUrl || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!PRICING[mode as PricingMode]) {
      return NextResponse.json(
        { error: 'Invalid pricing mode' },
        { status: 400 }
      );
    }

    const pricing = PRICING[mode as PricingMode];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Virtual Try-On - ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode`,
              description: `AI-powered virtual try-on for ${category}`,
              images: ['https://tryfitcheck.com/images/logo.png'],
            },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/try-on/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/try-on?canceled=true`,
      metadata: {
        mode,
        personImageUrl,
        garmentImageUrl,
        category,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
