import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { getPackageByPriceId } from '@/lib/stripe/config';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Webhook] Missing stripe-signature header');
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
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log('[Webhook] Event received:', event.type);

  try {
    // Use service role client to bypass RLS
    const supabase = createServiceRoleClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log('[Webhook] Checkout completed:', session.id);
        console.log('[Webhook] Metadata:', session.metadata);

        const userId = session.metadata?.user_id || session.client_reference_id;
        const credits = parseInt(session.metadata?.credits || '0');
        const packageName = session.metadata?.package_name;

        if (!userId) {
          console.error('[Webhook] No user ID found in session metadata');
          return NextResponse.json({ error: 'No user ID' }, { status: 400 });
        }

        if (!credits || credits <= 0) {
          console.error('[Webhook] Invalid credits amount:', credits);
          return NextResponse.json({ error: 'Invalid credits' }, { status: 400 });
        }

        // Check if user exists in web_users table, if not create
        const { data: existingUser } = await supabase
          .from('web_users')
          .select('id, credits')
          .eq('id', userId)
          .single();

        if (!existingUser) {
          // Get user email from auth.users
          const { data: authUser } = await supabase.auth.admin.getUserById(userId);

          await supabase
            .from('web_users')
            .insert({
              id: userId,
              email: authUser.user?.email || '',
              credits: credits,
              total_generations: 0,
            });
          console.log('[Webhook] Created new user record with credits:', credits);
        } else {
          // Add credits to existing user
          await supabase
            .from('web_users')
            .update({
              credits: existingUser.credits + credits,
            })
            .eq('id', userId);
          console.log('[Webhook] Added credits to existing user. New total:', existingUser.credits + credits);
        }

        // Create payment record
        await supabase
          .from('web_payments')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string || null,
            subscription_id: null,
            status: 'active',
            plan_type: packageName || 'one-time',
            credits_purchased: credits,
            current_period_end: null,
          }, {
            onConflict: 'user_id',
          });

        console.log('[Webhook] Payment record created for user:', userId);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[Webhook] Checkout session expired:', session.id);
        break;
      }

      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('[Webhook] Charge succeeded:', charge.id, 'Amount:', charge.amount / 100);
        break;
      }

      case 'charge.failed': {
        const charge = event.data.object as Stripe.Charge;
        console.error('[Webhook] Charge failed:', charge.id, 'Reason:', charge.failure_message);
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
