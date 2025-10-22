# Stripe Products Setup Guide

## Overview
You need to create 3 credit packages in Stripe Dashboard (both test and live mode).

## Pricing Structure

| Package | Price | Credits | Cost per Credit | Savings |
|---------|-------|---------|-----------------|---------|
| Starter | $5.00 | 20      | $0.25          | -       |
| Popular | $10.00| 50      | $0.20          | 20% ⭐  |
| Pro     | $25.00| 150     | $0.17          | 32%     |

---

## Step 1: Create Products in Test Mode

1. Go to [Stripe Dashboard - Test Mode](https://dashboard.stripe.com/test/products)
2. Click **"+ Add Product"**

### Product 1: Starter Package
- **Name**: `FitCheck - Starter Package`
- **Description**: `20 AI virtual try-on credits`
- **Pricing**:
  - Type: `One-time`
  - Price: `$5.00` USD
  - Billing period: Leave blank (one-time payment)
- Click **Save**
- **Copy the Price ID** (starts with `price_`) → Save as `STRIPE_STARTER_PRICE_TEST`

### Product 2: Popular Package
- **Name**: `FitCheck - Popular Package`
- **Description**: `50 AI virtual try-on credits (Best Value - 20% savings)`
- **Pricing**:
  - Type: `One-time`
  - Price: `$10.00` USD
- Click **Save**
- **Copy the Price ID** → Save as `STRIPE_POPULAR_PRICE_TEST`

### Product 3: Pro Package
- **Name**: `FitCheck - Pro Package`
- **Description**: `150 AI virtual try-on credits (32% savings)`
- **Pricing**:
  - Type: `One-time`
  - Price: `$25.00` USD
- Click **Save**
- **Copy the Price ID** → Save as `STRIPE_PRO_PRICE_TEST`

---

## Step 2: Create Products in Live Mode

1. Switch to **Live Mode** in Stripe Dashboard
2. Go to [Stripe Dashboard - Live Mode Products](https://dashboard.stripe.com/products)
3. **Repeat the exact same steps** as Test Mode above

You'll get 3 new Price IDs:
- `STRIPE_STARTER_PRICE_LIVE`
- `STRIPE_POPULAR_PRICE_LIVE`
- `STRIPE_PRO_PRICE_LIVE`

---

## Step 3: Add Price IDs to Vercel

Add these 6 environment variables to Vercel:

### Test Mode Price IDs
```bash
STRIPE_STARTER_PRICE_TEST=price_xxxxxxxxxxxxx
STRIPE_POPULAR_PRICE_TEST=price_xxxxxxxxxxxxx
STRIPE_PRO_PRICE_TEST=price_xxxxxxxxxxxxx
```

### Live Mode Price IDs
```bash
STRIPE_STARTER_PRICE_LIVE=price_xxxxxxxxxxxxx
STRIPE_POPULAR_PRICE_LIVE=price_xxxxxxxxxxxxx
STRIPE_PRO_PRICE_LIVE=price_xxxxxxxxxxxxx
```

---

## Step 4: Remove Manual Mode Variables (Optional)

Since mode is auto-detected, you can **remove** these from Vercel:
- ❌ `STRIPE_MODE`
- ❌ `NEXT_PUBLIC_STRIPE_MODE`

**Auto-detection logic:**
- `NEXT_PUBLIC_VERCEL_ENV=preview` → Test Mode
- `NEXT_PUBLIC_VERCEL_ENV=production` → Live Mode
- Local development → Test Mode

---

## Step 5: Configure Webhook

### Test Mode Webhook
1. Go to [Stripe Webhooks - Test Mode](https://dashboard.stripe.com/test/webhooks)
2. Click **"+ Add endpoint"**
3. **Endpoint URL**: `https://your-preview-domain.vercel.app/api/stripe/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. **Copy the Signing Secret** (starts with `whsec_`) → Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### Live Mode Webhook
1. Switch to Live Mode
2. Go to [Stripe Webhooks - Live Mode](https://dashboard.stripe.com/webhooks)
3. **Endpoint URL**: `https://tryfitcheck.com/api/stripe/webhook`
4. Select same events as above
5. Use the **same** `STRIPE_WEBHOOK_SECRET` variable (Vercel will route correctly)

---

## Verification Checklist

- [ ] 3 products created in Stripe Test Mode
- [ ] 3 products created in Stripe Live Mode
- [ ] 6 price IDs added to Vercel environment variables
- [ ] Test mode webhook configured
- [ ] Live mode webhook configured
- [ ] Webhook secret added to Vercel
- [ ] Manual `STRIPE_MODE` variables removed (optional)

---

## Testing

After setup:

1. Deploy to preview branch → Should use **test mode** prices
2. Test purchase with [Stripe test card](https://stripe.com/docs/testing): `4242 4242 4242 4242`
3. Check webhook is receiving events in Stripe Dashboard
4. Verify credits added to user account in Supabase

---

## Production Deployment

1. Merge to `main` branch
2. Vercel auto-deploys to production
3. Production automatically uses **live mode** prices
4. Real payments processed with real Stripe accounts

---

## Troubleshooting

### "Missing required environment variable: STRIPE_STARTER_PRICE_TEST"
- Make sure all 6 price IDs are added to Vercel
- Redeploy after adding variables

### Webhook not working
- Check endpoint URL matches deployment URL
- Verify webhook secret is correct
- Check Stripe Dashboard → Webhooks → Event logs

### Wrong mode being used
- Check `NEXT_PUBLIC_VERCEL_ENV` in deployment logs
- Preview deployments should be `preview`
- Production should be `production`
