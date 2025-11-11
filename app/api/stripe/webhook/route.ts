import { NextRequest, NextResponse } from 'next/server';
import { stripe, getCreditPackageByPriceId } from '@/lib/stripe';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log('[Stripe Webhook] Event type:', event.type);

  try {
    const supabase = createServiceRoleClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id || session.client_reference_id;

        if (!userId) {
          console.error('[Stripe Webhook] No user ID found in session metadata');
          return NextResponse.json({ error: 'No user ID' }, { status: 400 });
        }

        const packageId = session.metadata?.package_id;
        const creditsPurchased = parseInt(session.metadata?.credits_purchased || '0', 10);

        console.log('[Stripe Webhook] Processing payment for user:', userId);
        console.log('[Stripe Webhook] Package:', packageId);
        console.log('[Stripe Webhook] Credits:', creditsPurchased);

        // Create payment record
        const { error: paymentError } = await supabase
          .from('web_payments')
          .insert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            amount_total: session.amount_total || 0,
            currency: session.currency || 'usd',
            status: 'completed',
            credits_purchased: creditsPurchased,
            package_name: packageId,
            datafast_visitor_id: session.metadata?.datafast_visitor_id || null,
            datafast_session_id: session.metadata?.datafast_session_id || null,
            metadata: session.metadata || {},
          });

        if (paymentError) {
          console.error('[Stripe Webhook] Failed to create payment record:', paymentError);
          // Don't return error - still add credits even if payment record fails
        }

        // Add credits to user
        const { error: creditsError } = await supabase.rpc('add_user_credits', {
          p_user_id: userId,
          p_credits: creditsPurchased,
        });

        if (creditsError) {
          console.error('[Stripe Webhook] Failed to add credits:', creditsError);
          return NextResponse.json(
            { error: 'Failed to add credits' },
            { status: 500 }
          );
        }

        console.log('[Stripe Webhook] ✅ Credits added successfully');
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[Stripe Webhook] Session expired:', session.id);
        // Optionally track expired sessions for analytics
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        console.log('[Stripe Webhook] Processing refund for payment intent:', paymentIntentId);

        // Find the payment record
        const { data: payment } = await supabase
          .from('web_payments')
          .select('*')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .single();

        if (payment) {
          // Update payment status to refunded
          await supabase
            .from('web_payments')
            .update({ status: 'refunded' })
            .eq('id', payment.id);

          // Deduct the credits that were refunded
          const { error: deductError } = await supabase.rpc('deduct_user_credits', {
            p_user_id: payment.user_id,
            p_credits: payment.credits_purchased,
          });

          if (deductError) {
            console.error('[Stripe Webhook] Failed to deduct refunded credits:', deductError);
          } else {
            console.log('[Stripe Webhook] ✅ Refunded credits deducted');
          }
        }
        break;
      }

      default:
        console.log('[Stripe Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
