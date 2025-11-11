# Environment Variables Setup Guide

## What Works Without Configuration

The website can now deploy and function with **missing environment variables**. Here's what works:

### ✅ Always Available (No Config Needed)
- **Marketing Pages**: `/marketing`, `/privacypolicy`, `/termsofuse`, `/support`
- **Home Page**: Landing page with app information
- **Pricing Page**: Display of pricing packages (payment won't work without Stripe)

### ⚠️ Features That Require Configuration

## Supabase (Authentication & Database)
**Required for**: Login, Signup, Dashboard, User data storage

**Environment Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Without these**:
- Login/Signup pages will show an error message
- Protected routes (try-on, dashboard) will redirect to public pages
- User will see: "Authentication is not configured. Please contact support."

---

## Stripe (Payments)
**Required for**: Credit purchases, payment processing

**Environment Variables**:
```env
# Test Mode (Development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxx
STRIPE_SECRET_KEY_TEST=sk_test_xxx
STRIPE_STARTER_PRICE_TEST=price_xxx
STRIPE_POPULAR_PRICE_TEST=price_xxx
STRIPE_PRO_PRICE_TEST=price_xxx

# Live Mode (Production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_xxx
STRIPE_SECRET_KEY_LIVE=sk_live_xxx
STRIPE_STARTER_PRICE_LIVE=price_xxx
STRIPE_POPULAR_PRICE_LIVE=price_xxx
STRIPE_PRO_PRICE_LIVE=price_xxx

# Webhook
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Without these**:
- Pricing page displays correctly
- Buy buttons will fail when clicked
- User will see payment error messages

---

## AI Try-On APIs
**Required for**: Virtual try-on functionality

### Fashn API
```env
FASHN_API_KEY=fa-xxx
FASHN_API_ENDPOINT=https://api.fashn.ai/v1
```

### Google Gemini API
```env
GOOGLE_GEMINI_API_KEY=xxx
```

**Without these**:
- Try-on requests will fail with configuration error
- User will see: "AI service is not configured. Please contact support."

---

## Cloudflare R2 (Image Storage)
**Required for**: Storing uploaded images and results

**Environment Variables**:
```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=fitcheck-bucket
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

**Without these**:
- Image upload/storage will fail
- User will see: "Image storage is not configured. Please contact support."

---

## Deployment Strategy

### Phase 1: Marketing Site Only (No Config Needed)
Deploy with **zero environment variables** to show:
- Marketing content
- Pricing information
- Terms, Privacy, Support pages
- Professional landing page

This lets you test deployment without setting up any services.

### Phase 2: Add Authentication (Supabase Only)
Add Supabase credentials to enable:
- User registration and login
- User dashboard
- Protected routes

### Phase 3: Add Payments (+ Stripe)
Add Stripe credentials to enable:
- Credit purchases
- Payment processing
- Full e-commerce functionality

### Phase 4: Full Features (+ AI APIs + R2)
Add remaining credentials for:
- Virtual try-on with AI
- Image storage
- Complete app functionality

---

## Setting Environment Variables on Vercel

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add variables for the features you want to enable
4. Redeploy your application

The app will automatically detect which features are available and gracefully handle missing services.

---

## Error Handling

All services now fail gracefully with helpful error messages:
- Console warnings during build (won't crash)
- User-friendly error messages in the UI
- Specific guidance on what's missing

This allows **incremental deployment** - add features as you configure the required services!
