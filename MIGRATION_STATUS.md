# Credit-Based System Migration Status

**Date:** November 1, 2025
**Status:** PARTIALLY COMPLETE - Backend ready, frontend needs updates

---

## ✅ COMPLETED

### 1. Database Schema (Supabase)
- ✅ Updated `web_users` table with credit tracking fields
- ✅ Converted `web_payments` from subscription to one-time payments
- ✅ Added DataFast attribution fields
- ✅ Added missing indexes for performance
- ✅ Created `handle_new_user()` trigger function (auto-creates user with 3 free credits)
- ✅ Created `add_user_credits()` function (atomic credit addition)
- ✅ Created `deduct_user_credits()` function (atomic credit deduction with race condition protection)
- ✅ Updated database views for analytics

**File:** `supabase/setup.sql` - Ready to run in Supabase SQL Editor

### 2. TypeScript Types
- ✅ Updated `types/database.ts` to match new schema
- ✅ All types now correctly reflect credit-based system

### 3. Stripe Configuration
- ✅ Removed old pay-per-use pricing
- ✅ Added credit package pricing (Starter: $5/20 credits, Popular: $10/50 credits, Pro: $25/150 credits)
- ✅ Auto-detection of test vs live mode
- ✅ Helper functions for package lookups

**File:** `lib/stripe.ts`

### 4. Stripe Checkout API
- ✅ New `/api/stripe/checkout` endpoint for purchasing credit packages
- ✅ Requires authentication
- ✅ Captures DataFast cookies for revenue attribution
- ✅ Creates one-time payment session (not subscription)

**File:** `app/api/stripe/checkout/route.ts`

### 5. Stripe Webhook Handler
- ✅ Handles `checkout.session.completed` - adds credits after payment
- ✅ Handles `checkout.session.expired` - logs expired sessions
- ✅ Handles `charge.refunded` - deducts credits on refund
- ✅ Creates payment records in database
- ✅ Uses service role to bypass RLS

**File:** `app/api/stripe/webhook/route.ts`

### 6. Try-On API (Credit-Based)
- ✅ Already exists at `/api/tryon/generate`
- ✅ Requires authentication
- ✅ Checks user credits before generation
- ✅ Deducts credits after generation
- ✅ Stores generation history
- ✅ Supports Fashn API

**File:** `app/api/tryon/generate/route.ts`

### 7. Cleanup
- ✅ Removed `/api/checkout/route.ts` (old pay-per-use)
- ✅ Removed `/api/generate/route.ts` (old pay-per-use)

---

## ❌ NOT STARTED / NEEDS IMPLEMENTATION

### 1. Authentication UI
**Priority:** CRITICAL
**Status:** Not implemented

**Needs:**
- Sign up page (`/signup` or `/auth/signup`)
- Login page (`/login` or `/auth/login`)
- Google OAuth button
- Apple Sign-In button
- Email/password form
- Password reset flow
- Protected route middleware

**Dependencies:**
- Supabase Auth configured in dashboard
- Google OAuth credentials
- Apple Sign-In credentials

### 2. Try-On UI Updates
**Priority:** HIGH
**Status:** Still uses old pay-per-use flow

**Current Issues:**
- `app/(app)/try-on/page.tsx` calls deleted `/api/checkout` endpoint
- Shows pay-per-use pricing ($0.10, $0.25, $0.50)
- No credit balance display
- No auth check

**Needs to Change:**
1. Remove payment step from try-on flow
2. Check if user is authenticated
3. Display user's credit balance
4. Call `/api/tryon/generate` directly (no payment)
5. Handle insufficient credits → redirect to pricing page
6. Poll `/api/tryon/status/[id]` for completion

### 3. Pricing Page
**Priority:** HIGH
**Status:** Probably shows old pricing

**Needs:**
- Display credit packages (Starter, Popular, Pro)
- Call `/api/stripe/checkout` with `packageId`
- Show "Best Value" badge on Popular package
- Require authentication before purchase

### 4. User Dashboard
**Priority:** MEDIUM
**Status:** Not implemented

**Needs:**
- Credit balance display (large, prominent)
- Recent try-on history
- Payment history
- "Buy More Credits" button → pricing page

### 5. Payment Success Page
**Priority:** MEDIUM
**Status:** Unknown if exists

**Needs:**
- `/payment/success` route
- Shows credits added
- Links to try-on page or dashboard

### 6. Protected Routes
**Priority:** HIGH
**Status:** Not implemented

**Needs middleware** to protect:
- `/try-on` - redirect to `/login` if not authenticated
- `/dashboard` - redirect to `/login` if not authenticated
- `/pricing` - can view but must login to purchase

### 7. Google Nano Banana AI
**Priority:** LOW (Fashn works)
**Status:** Placeholder only

**Needs:**
- Research actual Google Gemini 2.5 Flash API
- Implement in `lib/google-nano/client.ts`
- Update `/api/tryon/generate` to support it
- Add UI toggle for AI provider selection

---

## 🔧 IMMEDIATE NEXT STEPS

### Step 1: Set Up Supabase Database
```bash
# Go to Supabase Dashboard → SQL Editor
# Run: supabase/setup.sql
```

### Step 2: Configure Supabase Auth
1. Enable Google OAuth in Supabase Dashboard
2. Enable Apple Sign-In in Supabase Dashboard
3. Enable Email/Password auth
4. Set redirect URLs

### Step 3: Create Stripe Products
1. Go to Stripe Dashboard → Products
2. Create 3 products (Starter, Popular, Pro)
3. Create prices for each ($5, $10, $25)
4. Copy price IDs to `.env.local`
5. Repeat for live mode

### Step 4: Implement Auth UI
- Create `/app/(auth)/login/page.tsx`
- Create `/app/(auth)/signup/page.tsx`
- Add Supabase auth components

### Step 5: Update Try-On Page
- Check auth status
- Display credits
- Remove payment flow
- Call `/api/tryon/generate` directly

### Step 6: Update Pricing Page
- Show credit packages
- Integrate with `/api/stripe/checkout`

### Step 7: Create Dashboard
- Create `/app/(app)/dashboard/page.tsx`
- Show credits, history, etc.

### Step 8: Set Up Stripe Webhook
1. Create endpoint in Stripe Dashboard
2. URL: `https://yourdomain.com/api/stripe/webhook`
3. Events: `checkout.session.completed`, `checkout.session.expired`, `charge.refunded`
4. Copy signing secret to env vars

### Step 9: Test End-to-End
1. Sign up new user (should get 3 free credits)
2. Purchase credits
3. Use try-on (should deduct credits)
4. Check webhook logs

---

## 📝 ENVIRONMENT VARIABLES CHECKLIST

Ensure these are set in `.env.local` and Vercel:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe Test Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=
STRIPE_SECRET_KEY_TEST=
STRIPE_STARTER_PRICE_TEST=
STRIPE_POPULAR_PRICE_TEST=
STRIPE_PRO_PRICE_TEST=

# Stripe Live Mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=
STRIPE_SECRET_KEY_LIVE=
STRIPE_STARTER_PRICE_LIVE=
STRIPE_POPULAR_PRICE_LIVE=
STRIPE_PRO_PRICE_LIVE=

# Stripe Webhook
STRIPE_WEBHOOK_SECRET=

# AI APIs
FASHN_API_KEY=
FASHN_API_ENDPOINT=https://api.fashn.ai/v1

# Other
NEXT_PUBLIC_APP_DOMAIN=
NEXT_PUBLIC_DATAFAST_WEBSITE_ID=
```

---

## 🐛 KNOWN ISSUES

1. **Try-on page will break** - calls deleted `/api/checkout`
2. **No authentication flow** - users can't sign up/login yet
3. **Google Nano Banana** - not implemented (only placeholder)

---

## 🎯 SUCCESS CRITERIA

Migration is complete when:
- [x] Backend supports credit-based payments
- [x] Database schema updated
- [x] Stripe webhook adds credits
- [ ] Users can sign up and get 3 free credits
- [ ] Users can buy credit packages
- [ ] Users can see their credit balance
- [ ] Try-on deducts credits (not payment)
- [ ] All APIs use new credit-based flow
- [ ] Old pay-per-use code removed

**Current Progress:** 6/10 (60%)

---

**Next file to work on:** Authentication UI or Try-On UI update
