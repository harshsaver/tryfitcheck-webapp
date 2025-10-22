# Stripe + DataFast Integration Guide

Universal implementation guide for Stripe subscription payments with DataFast revenue attribution for Next.js 15 projects deployed on Vercel with Supabase.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture](#architecture)
- [Setup & Configuration](#setup--configuration)
- [Implementation](#implementation)
- [DataFast Revenue Attribution](#datafast-revenue-attribution)
- [Webhook Configuration](#webhook-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Customization Guide](#customization-guide)

---

## Overview

This implementation provides a complete, production-ready payment system with:
- Stripe Checkout for subscription payments
- Configurable trial periods
- Multiple pricing tiers
- Automatic subscription management via webhooks
- Revenue attribution via DataFast analytics
- Real-time payment verification
- Production-ready error handling

**Tech Stack:**
- Next.js 15 App Router
- Stripe API 2025-09-30
- Supabase (PostgreSQL + Auth)
- DataFast Analytics
- Vercel (Deployment)

---

## Prerequisites

Before implementing this solution, ensure you have:

### 1. Accounts & Services
- [ ] [Stripe Account](https://dashboard.stripe.com/register) (with test and live mode access)
- [ ] [Supabase Project](https://app.supabase.com/) (with database and auth configured)
- [ ] [DataFast Account](https://datafa.st/) (with website created)
- [ ] [Vercel Account](https://vercel.com/) (with project deployed)

### 2. Stripe Products Setup
- [ ] Create your products in Stripe (test mode)
- [ ] Create your products in Stripe (live mode)
- [ ] Note down Price IDs and Product IDs for each plan

### 3. Supabase Setup
- [ ] Supabase Auth enabled
- [ ] `profiles` table exists (or equivalent user profile storage)
- [ ] Service role key available

### 4. Domain Configuration
- [ ] Production domain configured (`www.yourdomain.com`)
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Confirm if domain redirects (e.g., `yourdomain.com` → `www.yourdomain.com`)

---

## Architecture

### Payment Flow

```
User → Payment Button → Create Checkout Session API
                       ↓
                  Stripe Checkout Page (hosted by Stripe)
                       ↓
                  User Completes Payment
                       ↓
                  Stripe Webhook → Update Database
                       ↓
                  Success Page → Dashboard Access
```

### Key Components

1. **Frontend:**
   - Payment UI component (modal/page)
   - Payment success page
   - Optional: Payment failure handler

2. **Backend API Routes:**
   - `/api/stripe/create-checkout-session` - Creates Stripe session
   - `/api/stripe/webhook` - Handles Stripe events
   - `/api/stripe/verify-payment` - Syncs payment status (optional but recommended)
   - `/api/stripe/prices` - Fetches product pricing (optional)

3. **Database Schema:**
   ```sql
   CREATE TABLE payments (
     user_id UUID PRIMARY KEY REFERENCES auth.users(id),
     stripe_customer_id TEXT,
     subscription_id TEXT UNIQUE,
     status TEXT NOT NULL,
     plan_type TEXT,
     current_period_end TIMESTAMPTZ,
     trial_ends_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

---

## Setup & Configuration

### 1. Environment Variables

**IMPORTANT:** Use these **exact variable names**. The config file depends on these specific names.

#### Vercel Environment Variables Setup

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables with their respective values:

| Variable Name | Example Value | Environment | Description |
|--------------|---------------|-------------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST` | `pk_test_51Abc...` | Development, Preview | Test mode publishable key |
| `STRIPE_SECRET_KEY_TEST` | `sk_test_51Abc...` | Development, Preview | Test mode secret key |
| `STRIPE_PRO_PRICE_TEST` | `price_1Abc...` | Development, Preview | Test Tier 1 price ID |
| `STRIPE_PRO_PLUS_PRICE_TEST` | `price_1Def...` | Development, Preview | Test Tier 2 price ID |
| `STRIPE_PRO_ID_TEST` | `prod_Abc...` | Development, Preview | Test Tier 1 product ID |
| `STRIPE_PRO_PLUS_ID_TEST` | `prod_Def...` | Development, Preview | Test Tier 2 product ID |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE` | `pk_live_51Xyz...` | Production | Live mode publishable key |
| `STRIPE_SECRET_KEY_LIVE` | `sk_live_51Xyz...` | Production | Live mode secret key |
| `STRIPE_PRO_PRICE_LIVE` | `price_1Xyz...` | Production | Live Tier 1 price ID |
| `STRIPE_PRO_PLUS_PRICE_LIVE` | `price_1Uvw...` | Production | Live Tier 2 price ID |
| `STRIPE_PRO_ID_LIVE` | `prod_Xyz...` | Production | Live Tier 1 product ID |
| `STRIPE_PRO_PLUS_ID_LIVE` | `prod_Uvw...` | Production | Live Tier 2 product ID |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production | Live webhook signing secret |
| `NEXT_PUBLIC_APP_DOMAIN` | `https://www.yourdomain.com` | Production | Your production domain |

**Note on naming:** The example uses "Pro" and "Pro Plus" as tier names. Rename these in your config to match your product names (e.g., Basic/Premium, Starter/Business, etc.).

#### `.env.local` for Local Development

```bash
# Stripe Test Mode (Development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxxxx
STRIPE_SECRET_KEY_TEST=sk_test_xxxxx
STRIPE_PRO_PRICE_TEST=price_xxxxx
STRIPE_PRO_PLUS_PRICE_TEST=price_xxxxx
STRIPE_PRO_ID_TEST=prod_xxxxx
STRIPE_PRO_PLUS_ID_TEST=prod_xxxxx

# Stripe Live Mode (Not used locally, but good to have)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_xxxxx
STRIPE_SECRET_KEY_LIVE=sk_live_xxxxx
STRIPE_PRO_PRICE_LIVE=price_xxxxx
STRIPE_PRO_PLUS_PRICE_LIVE=price_xxxxx
STRIPE_PRO_ID_LIVE=prod_xxxxx
STRIPE_PRO_PLUS_ID_LIVE=prod_xxxxx

# Webhook Secret (Test mode for local)
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx

# App Domain
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000

# Supabase (if using local env file)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### How to Get These Values

**Stripe Test Mode Keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. Ensure **Test mode** toggle is ON (top right)
3. Go to **Developers → API keys**
4. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST`
5. Copy **Secret key** → `STRIPE_SECRET_KEY_TEST`

**Stripe Live Mode Keys:**
1. Switch to **Live mode** in Stripe Dashboard
2. Go to **Developers → API keys**
3. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE`
4. Copy **Secret key** → `STRIPE_SECRET_KEY_LIVE`

**Price and Product IDs:**
1. Go to **Products** in Stripe Dashboard
2. Click on your first product (e.g., "Pro" tier)
3. Copy **Price ID** (starts with `price_`) → `STRIPE_PRO_PRICE_TEST` or `STRIPE_PRO_PRICE_LIVE`
4. Copy **Product ID** (starts with `prod_`) → `STRIPE_PRO_ID_TEST` or `STRIPE_PRO_ID_LIVE`
5. Repeat for your second product (e.g., "Pro Plus" tier)

**Webhook Secret:**
1. Go to **Developers → Webhooks** in Stripe
2. Click on your webhook endpoint
3. Click **"Reveal"** next to Signing secret
4. Copy the secret (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`

⚠️ **CRITICAL:** Never mix test and live keys! The config file automatically selects the correct set based on your environment.

---

### 2. Stripe Configuration File

Create this file to manage environment-based configuration:

**File:** `lib/stripe/config.ts`

```typescript
// Automatically selects test or live mode based on environment
export const isTestMode =
  process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
  process.env.NEXT_PUBLIC_STRIPE_MODE === 'test';

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Mode: ${isTestMode ? 'TEST' : 'LIVE'}\n` +
      `Please check your .env file or Vercel environment variables.`
    );
  }
  return value;
}

export const stripeConfig = {
  publishableKey: isTestMode
    ? getRequiredEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST')
    : getRequiredEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE'),

  secretKey: isTestMode
    ? getRequiredEnvVar('STRIPE_SECRET_KEY_TEST')
    : getRequiredEnvVar('STRIPE_SECRET_KEY_LIVE'),

  proPriceId: isTestMode
    ? getRequiredEnvVar('STRIPE_PRO_PRICE_TEST')
    : getRequiredEnvVar('STRIPE_PRO_PRICE_LIVE'),

  proPlusPriceId: isTestMode
    ? getRequiredEnvVar('STRIPE_PRO_PLUS_PRICE_TEST')
    : getRequiredEnvVar('STRIPE_PRO_PLUS_PRICE_LIVE'),

  proProductId: isTestMode
    ? getRequiredEnvVar('STRIPE_PRO_ID_TEST')
    : getRequiredEnvVar('STRIPE_PRO_ID_LIVE'),

  proPlusProductId: isTestMode
    ? getRequiredEnvVar('STRIPE_PRO_PLUS_ID_TEST')
    : getRequiredEnvVar('STRIPE_PRO_PLUS_ID_LIVE'),
};

// Customize these plan names to match your product names
export const PLAN_NAMES = {
  PRO: 'Pro',           // Change to your Tier 1 name
  PRO_PLUS: 'Pro Plus', // Change to your Tier 2 name
} as const;
```

**Customization:**
- Rename `PRO` and `PRO_PLUS` to match your pricing tiers (e.g., `BASIC`, `PREMIUM`)
- Add more tiers by adding more config entries

---

### 3. Stripe Client

**File:** `lib/stripe/client.ts`

```typescript
import Stripe from 'stripe';
import { stripeConfig } from './config';

// Server-side Stripe client (never expose on client!)
export const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2025-09-30.clover', // Latest API version
  typescript: true,
});

// Fetch price details from Stripe (optional helper function)
export async function getStripePrices() {
  try {
    const [proPrice, proPlusPrice] = await Promise.all([
      stripe.prices.retrieve(stripeConfig.proPriceId, {
        expand: ['product'],
      }),
      stripe.prices.retrieve(stripeConfig.proPlusPriceId, {
        expand: ['product'],
      }),
    ]);

    return {
      pro: {
        id: proPrice.id,
        amount: proPrice.unit_amount! / 100, // Convert cents to dollars/euros
        currency: proPrice.currency,
        interval: proPrice.recurring?.interval || 'month',
        product: proPrice.product as Stripe.Product,
      },
      proPlus: {
        id: proPlusPrice.id,
        amount: proPlusPrice.unit_amount! / 100,
        currency: proPlusPrice.currency,
        interval: proPlusPrice.recurring?.interval || 'month',
        product: proPlusPrice.product as Stripe.Product,
      },
    };
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    throw error;
  }
}
```

**Note:** If you have more than 2 pricing tiers, expand this function accordingly.

---

### 4. Supabase Service Role Client

Create a service role client for webhook operations (bypasses RLS):

**File:** `lib/supabase/service-role.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

---

## Implementation

### 1. Create Checkout Session API

This endpoint creates a Stripe Checkout session with DataFast cookies for revenue attribution.

**File:** `app/api/stripe/create-checkout-session/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
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

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile for customer info (optional)
    // Adjust table/column names to match your schema
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single();

    // Get base URL from request headers (works on Vercel)
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    let baseUrl = host ? `${protocol}://${host}` : process.env.NEXT_PUBLIC_APP_DOMAIN;

    // Get DataFast cookies for revenue attribution
    const cookieStore = await cookies();
    const datafast_visitor_id = cookieStore.get('datafast_visitor_id')?.value || '';
    const datafast_session_id = cookieStore.get('datafast_session_id')?.value || '';

    console.log('[Stripe] DataFast visitor ID:', datafast_visitor_id ? 'present' : 'missing');
    console.log('[Stripe] DataFast session ID:', datafast_session_id ? 'present' : 'missing');

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Customize these URLs to match your app routes
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/pricing?payment=cancelled`, // or wherever user should return
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        user_email: user.email || '',
        user_name: profile ? `${profile.first_name} ${profile.last_name}` : '',
        // DataFast revenue attribution cookies (CRITICAL for revenue tracking)
        datafast_visitor_id,
        datafast_session_id,
      },
      subscription_data: {
        trial_period_days: 15, // Customize or remove trial period
        metadata: {
          user_id: user.id,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

**Customization Points:**
- `success_url` and `cancel_url` - Update to match your app routes
- `trial_period_days` - Adjust trial length or remove for no trial
- User profile query - Adjust to match your database schema
- Metadata - Add any additional data you want to track

---

### 2. Webhook Handler

This endpoint receives and processes Stripe webhook events.

**File:** `app/api/stripe/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { stripeConfig, PLAN_NAMES } from '@/lib/stripe/config';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
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
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  console.log('[Webhook] Event type:', event.type);

  try {
    // Use service role client to bypass RLS
    const supabase = createServiceRoleClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id || session.client_reference_id;

        if (!userId) {
          console.error('[Webhook] No user ID found');
          return NextResponse.json({ error: 'No user ID' }, { status: 400 });
        }

        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const subscriptionItem = subscription.items.data[0];

        // Determine plan type based on price ID
        const priceId = subscriptionItem.price.id;
        let planName = PLAN_NAMES.PRO;
        if (priceId === stripeConfig.proPlusPriceId) {
          planName = PLAN_NAMES.PRO_PLUS;
        }

        // Create or update payment record
        await supabase
          .from('payments')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            subscription_id: subscriptionId,
            status: subscription.status,
            plan_type: planName,
            current_period_end: subscriptionItem.current_period_end
              ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
              : null,
            trial_ends_at: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          }, {
            onConflict: 'user_id',
          });

        console.log('[Webhook] Payment record created for user:', userId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;

        if (!userId) {
          return NextResponse.json({ error: 'No user ID' }, { status: 400 });
        }

        const subscriptionItem = subscription.items.data[0];
        const priceId = subscriptionItem.price.id;

        let planName = PLAN_NAMES.PRO;
        if (priceId === stripeConfig.proPlusPriceId) {
          planName = PLAN_NAMES.PRO_PLUS;
        }

        await supabase
          .from('payments')
          .update({
            status: subscription.status,
            plan_type: planName,
            current_period_end: subscriptionItem.current_period_end
              ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
              : null,
          })
          .eq('subscription_id', subscription.id);

        console.log('[Webhook] Subscription updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase
          .from('payments')
          .update({ status: 'canceled' })
          .eq('subscription_id', subscription.id);

        console.log('[Webhook] Subscription canceled:', subscription.id);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;

        // Handle subscription invoices only
        if (invoice.subscription && typeof invoice.subscription === 'string') {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const subscriptionItem = subscription.items.data[0];
          const priceId = subscriptionItem.price.id;

          let planName = PLAN_NAMES.PRO;
          if (priceId === stripeConfig.proPlusPriceId) {
            planName = PLAN_NAMES.PRO_PLUS;
          }

          await supabase
            .from('payments')
            .update({
              status: subscription.status,
              plan_type: planName,
              current_period_end: subscriptionItem.current_period_end
                ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
                : null,
            })
            .eq('subscription_id', subscription.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription && typeof invoice.subscription === 'string') {
          await supabase
            .from('payments')
            .update({ status: 'past_due' })
            .eq('subscription_id', invoice.subscription);
        }
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

**Webhook Events Handled:**
- ✅ `checkout.session.completed` - Initial subscription created
- ✅ `customer.subscription.updated` - Subscription changed (plan upgrade/downgrade)
- ✅ `customer.subscription.deleted` - Subscription canceled
- ✅ `invoice.paid` - Recurring payment successful
- ✅ `invoice.payment_failed` - Payment failed

---

### 3. Payment Verification API (Optional)

Real-time verification that syncs Stripe status with your database.

**File:** `app/api/stripe/verify-payment/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { stripeConfig, PLAN_NAMES } from '@/lib/stripe/config';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check database first
    const { data: paymentData } = await supabase
      .from('payments')
      .select('stripe_customer_id, subscription_id, status, plan_type, created_at')
      .eq('user_id', user.id)
      .maybeSingle();

    // Verify with Stripe API if customer exists
    if (paymentData?.stripe_customer_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: paymentData.stripe_customer_id,
          status: 'all',
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];

          // Sync if Stripe status differs from DB
          if (
            (subscription.status === 'active' || subscription.status === 'trialing') &&
            paymentData.status !== subscription.status
          ) {
            const subscriptionItem = subscription.items.data[0];
            const priceId = subscriptionItem?.price.id;

            let planName = PLAN_NAMES.PRO;
            if (priceId === stripeConfig.proPlusPriceId) {
              planName = PLAN_NAMES.PRO_PLUS;
            }

            const supabaseAdmin = createServiceRoleClient();
            await supabaseAdmin
              .from('payments')
              .update({
                status: subscription.status,
                plan_type: planName,
                subscription_id: subscription.id,
                current_period_end: subscriptionItem?.current_period_end
                  ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
                  : null,
              })
              .eq('user_id', user.id);

            return NextResponse.json({
              status: subscription.status,
              plan_type: planName,
              created_at: paymentData.created_at,
              synced: true,
            });
          }

          return NextResponse.json({
            status: subscription.status,
            plan_type: paymentData.plan_type,
            created_at: paymentData.created_at,
            stripe_verified: true,
          });
        }
      } catch (stripeError) {
        console.error('[Verify Payment] Stripe API error:', stripeError);
      }
    }

    if (paymentData) {
      return NextResponse.json({
        status: paymentData.status,
        plan_type: paymentData.plan_type,
        created_at: paymentData.created_at,
        stripe_verified: false,
      });
    }

    return NextResponse.json({ status: null, plan_type: null });
  } catch (error) {
    console.error('[Verify Payment] Error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
```

---

### 4. Get Prices API (Optional)

Fetch product pricing dynamically from Stripe.

**File:** `app/api/stripe/prices/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getStripePrices } from '@/lib/stripe/client';

export async function GET() {
  try {
    const prices = await getStripePrices();
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
```

---

## DataFast Revenue Attribution

### 1. Install DataFast Tracking Script

Add the DataFast script to your root layout to track all pages.

**File:** `app/layout.tsx`

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* DataFast Analytics - Tracks page views and custom events */}
        <script
          defer
          data-website-id="dfid_YOUR_WEBSITE_ID" // Replace with your DataFast website ID
          data-domain="www.yourdomain.com"       // Replace with your domain
          src="https://datafa.st/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Where to get `data-website-id`:**
1. Go to [DataFast Dashboard](https://datafa.st/dashboard)
2. Create a new website or select existing
3. Copy the website ID (starts with `dfid_`)

---

### 2. Create Analytics Utility (Optional)

Track custom goals for better insights.

**File:** `lib/analytics.ts`

```typescript
declare global {
  interface Window {
    datafast?: (action: string, data?: Record<string, unknown>) => void;
  }
}

export function trackGoal(goalName: string, properties?: Record<string, unknown>) {
  try {
    if (typeof window !== 'undefined' && window.datafast) {
      window.datafast('goal', {
        name: goalName,
        ...properties
      });
      console.log('[Analytics] Goal tracked:', goalName, properties);
    }
  } catch (error) {
    console.error('[Analytics] Error tracking goal:', goalName, error);
  }
}

// Define your custom goals
export const GOALS = {
  PAYMENT_PAGE_VIEWED: 'payment_page_viewed',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
} as const;
```

---

### 3. Track Payment Events

Add tracking to your payment components:

```typescript
import { trackGoal, GOALS } from '@/lib/analytics';

// When user opens payment page
trackGoal(GOALS.PAYMENT_PAGE_VIEWED);

// When user clicks payment button
const handlePaymentClick = (priceId: string) => {
  trackGoal(GOALS.PAYMENT_INITIATED, { priceId });
  // ... proceed with checkout
};

// On payment success page
useEffect(() => {
  trackGoal(GOALS.PAYMENT_COMPLETED);
}, []);
```

---

### 4. Connect DataFast to Stripe

1. Go to **DataFast Dashboard → Settings → Revenue**
2. Select **"Stripe Checkout API"**
3. Connect your Stripe account
4. DataFast will automatically attribute revenue

**How Revenue Attribution Works:**
1. DataFast script sets cookies (`datafast_visitor_id`, `datafast_session_id`)
2. Your checkout API captures these cookies
3. Cookies are passed to Stripe in checkout metadata
4. Stripe sends metadata back to DataFast
5. DataFast matches visitor to traffic source
6. You see which campaigns/channels generate revenue

---

## Webhook Configuration

### Setup in Stripe Dashboard

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)

2. Click **"Add endpoint"**

3. **Endpoint URL:** `https://www.yourdomain.com/api/stripe/webhook`

   ⚠️ **CRITICAL:**
   - If your domain redirects (e.g., `yourdomain.com` → `www.yourdomain.com`), use the final URL
   - Stripe does NOT follow 307 redirects
   - Test with: `curl -I https://yourdomain.com` (should return 200, not 307)

4. **Select events to listen to:**
   ```
   ✅ checkout.session.completed
   ✅ checkout.session.expired
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ✅ invoice.paid
   ✅ invoice.payment_failed
   ```

5. Click **"Add endpoint"**

6. **Copy the signing secret** (starts with `whsec_...`)

7. Add to **Vercel Environment Variables:**
   - Variable: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_xxxxxxxxxxxxx`
   - Environment: **Production**

8. Add to `.env.local` for local testing:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_test_xxxxxxxxxxxxx
   ```

---

### Test Webhooks Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, trigger test event
stripe trigger checkout.session.completed
```

---

## Testing

### Test Mode Checklist

1. ✅ Environment variables configured for test mode
2. ✅ Using Stripe test keys in development
3. ✅ Test products created in Stripe
4. ✅ Webhook endpoint configured (can use Stripe CLI for local)

### Test Cards

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | 3D Secure required |

### Test Flow

1. Create test account in your app
2. Navigate to payment/pricing page
3. Click subscribe button
4. Use test card `4242 4242 4242 4242`
5. Complete checkout
6. Verify:
   - Payment record created in database
   - Webhook event received in Stripe logs
   - DataFast cookies present in Stripe metadata
   - User granted access

---

### Production Checklist

Before going live:

- [ ] Switch to live Stripe keys in Vercel (Production environment)
- [ ] Create live webhook endpoint with correct domain
- [ ] Update `STRIPE_WEBHOOK_SECRET` with live webhook secret
- [ ] Test with small real payment
- [ ] Verify webhook delivery in Stripe Dashboard
- [ ] Confirm payment record created in database
- [ ] Check DataFast revenue attribution (24-48 hours after first payment)
- [ ] Test subscription cancellation flow
- [ ] Test payment failure scenarios

---

## Troubleshooting

### Webhook Issues

| Problem | Solution |
|---------|----------|
| **307 Redirect** | Use `www.yourdomain.com` instead of `yourdomain.com` |
| **Signature verification failed** | Check `STRIPE_WEBHOOK_SECRET` matches endpoint |
| **Database not updating** | Verify Supabase service role key and RLS policies |
| **No webhook events** | Check endpoint URL in Stripe Dashboard |

### Payment Issues

| Problem | Solution |
|---------|----------|
| **Checkout session fails** | Verify all Stripe env vars are set correctly |
| **Wrong price in test/live** | Check price IDs match current mode |
| **DataFast cookies missing** | Verify DataFast script loaded, check for ad blockers |
| **Trial not working** | Check `trial_period_days` is set and Stripe allows trials |

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Missing stripe-signature header` | Webhook misconfigured | Verify endpoint URL in Stripe Dashboard |
| `No such price: price_xxx` | Wrong price ID for mode | Use test prices in dev, live in prod |
| `Unauthorized` | Auth session missing | Check Supabase session is valid |
| `No user ID found` | Metadata missing in webhook | Ensure metadata is set in checkout session |

---

## Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Create payments table
CREATE TABLE payments (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (
    status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired')
  ),
  plan_type TEXT,
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment
CREATE POLICY "Users can view own payment"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all payments (for webhooks)
CREATE POLICY "Service role can manage payments"
  ON payments FOR ALL
  USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX idx_payments_stripe_customer ON payments(stripe_customer_id);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
```

---

## Customization Guide

### Change Plan Names

**In `lib/stripe/config.ts`:**
```typescript
export const PLAN_NAMES = {
  BASIC: 'Basic',      // Your Tier 1 name
  PREMIUM: 'Premium',  // Your Tier 2 name
} as const;
```

**Update throughout codebase:**
- Search and replace `PRO` with your tier name
- Search and replace `PRO_PLUS` with your tier name

### Add More Pricing Tiers

1. **Add environment variables:**
   ```bash
   STRIPE_ENTERPRISE_PRICE_TEST=price_xxx
   STRIPE_ENTERPRISE_PRICE_LIVE=price_xxx
   STRIPE_ENTERPRISE_ID_TEST=prod_xxx
   STRIPE_ENTERPRISE_ID_LIVE=prod_xxx
   ```

2. **Update `lib/stripe/config.ts`:**
   ```typescript
   enterprisePriceId: isTestMode
     ? getRequiredEnvVar('STRIPE_ENTERPRISE_PRICE_TEST')
     : getRequiredEnvVar('STRIPE_ENTERPRISE_PRICE_LIVE'),
   ```

3. **Update webhook handler** to recognize new plan

### Change Trial Period

**In checkout session:**
```typescript
subscription_data: {
  trial_period_days: 30, // Change from 15 to 30 days
  metadata: { user_id: user.id },
}
```

Or remove trial entirely:
```typescript
// Remove subscription_data.trial_period_days
```

### Custom Success/Cancel URLs

**In checkout session:**
```typescript
success_url: `${baseUrl}/dashboard?payment=success`,
cancel_url: `${baseUrl}/pricing?payment=cancelled`,
```

---

## Key Benefits of This Implementation

1. **DataFast Revenue Attribution**
   - Know which marketing channels generate revenue
   - Optimize ad spend based on real ROI data

2. **Stripe API 2025 Compliant**
   - Uses latest subscription item structure
   - Future-proof implementation

3. **Automatic Test/Live Switching**
   - No code changes needed between environments
   - Prevents accidental mixing of test/live data

4. **Real-time Verification**
   - Syncs Stripe status with database
   - Handles webhook failures gracefully

5. **Production-Ready Security**
   - Service role for webhooks (bypasses RLS)
   - Signature verification
   - Proper error handling

---

## Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)
- [DataFast Documentation](https://docs.datafa.st)
- [Next.js 15 App Router](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment](https://vercel.com/docs)

---

**Last Updated:** October 2025
**Stripe API Version:** 2025-09-30
**Next.js Version:** 15.x
**Compatible With:** Vercel, Supabase, DataFast

---

This guide is designed to be universally applicable to any Next.js 15 project using Stripe subscriptions, Supabase auth, and DataFast analytics. Customize the plan names, trial periods, and URLs to match your specific application.
