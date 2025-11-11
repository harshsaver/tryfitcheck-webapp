# FitCheck Web Application

> A beautiful, Gen-Z focused web platform with AI-powered Virtual Try-On functionality powered by Fashn API and Google Gemini.

## 🎯 Project Overview

FitCheck is a comprehensive web application that serves dual purposes:
1. **Marketing Landing Page**: Beautiful, SEO-optimized landing page for the FitCheck mobile app
2. **Virtual Try-On Platform**: Credit-based web virtual try-on feature using AI (Fashn API & Google Gemini)

## 🏗 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google, Apple, Email/Password)
- **Image Storage**: Cloudflare R2 (S3-compatible object storage)
- **Payments**: Stripe Checkout (Credit Packages)
- **Analytics**: DataFast (Revenue Attribution)
- **AI Models**:
  - **Fashn API v1.6** (Primary Virtual Try-On Model)
  - **Google Gemini 2.5 Flash Image** (Alternative Try-On Model)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS v3.4 + Framer Motion

## 🤖 AI Models

### 1. Fashn API v1.6 (Primary)

**Endpoint:** `https://api.fashn.ai/v1`

**Model:** `tryon-v1.6`

**Parameters:**
```typescript
{
  model_name: "tryon-v1.6",
  inputs: {
    model_image: string,      // Person photo URL/base64
    garment_image: string,    // Garment photo URL/base64
    category: "tops" | "bottoms" | "one-pieces" | "auto",
    mode: "performance" | "balanced" | "quality",
    segmentation_free: true,
    moderation_level: "permissive",
    garment_photo_type: "auto",
    num_samples: 1,
    output_format: "png"
  }
}
```

**Polling:** `/status/{prediction_id}` every 3 seconds

**Pricing:** ~$0.10-0.15 per generation (varies by mode)

### 2. Google Gemini 2.5 Flash Image (Alternative)

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`

**Model:** `gemini-2.5-flash-image`

**Use Case:** AI-powered image composition for virtual try-on

**Pricing:** $30 per 1M tokens (~$0.039 per image)

**Key Feature:** Instant generation (no polling required)

## 💳 Payment System

**Model:** Credit-based (Prepaid Credits)

**Credit Packages:**
- **Starter**: $5 for 20 credits ($0.25/credit)
- **Popular**: $10 for 50 credits ($0.20/credit) ⭐ Best Value - 20% savings
- **Pro**: $25 for 150 credits ($0.17/credit) - 32% savings

**How it Works:**
1. User signs up → Gets 3 free trial credits automatically
2. Purchase credit packages via Stripe Checkout
3. Each virtual try-on costs 1 credit (regardless of AI provider)
4. Credits never expire

**Stripe Implementation:**
- Follows [docs/STRIPE_DATAFAST_DOC.md](docs/STRIPE_DATAFAST_DOC.md)
- DataFast revenue attribution via cookies
- Webhook-based credit fulfillment
- Auto-switching between test/live mode

### Profitability Analysis

**Stripe Fees (2.9% + $0.30):**
- $5 package: Fee $0.45 (9%), You get $4.55
- $10 package: Fee $0.59 (6%), You get $9.41
- $25 package: Fee $1.03 (4%), You get $23.97

**AI Costs (Per Try-On):**
- Fashn: ~$0.10-0.15
- Google Gemini: ~$0.039

**Margin:**
- Sell at $0.17-0.25/credit
- Cost $0.04-0.15/credit
- **Profit: $0.02-0.21/credit** ✅

## 🔐 Authentication

**Providers:**
- ✅ Google Sign-In
- ✅ Apple Sign-In
- ✅ Email/Password

**Flow:**
1. User signs up (Google/Apple/Email)
2. Automatically receives 3 free trial credits via database trigger
3. Can purchase more credits anytime
4. Use credits for virtual try-ons

**Protected Routes:**
- `/try-on` - Requires authentication
- `/dashboard` - Requires authentication
- `/pricing` - Public (requires auth to purchase)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Stripe account (test + live mode)
- Fashn API key
- Google Gemini API key
- DataFast account
- Cloudflare R2 bucket

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Set up Supabase database
# Go to Supabase Dashboard → SQL Editor
# Run the script in: supabase/setup.sql

# Configure Supabase Auth providers
# Enable Google, Apple, Email/Password in Supabase Dashboard

# Create Stripe products and prices
# Create 3 products in Stripe Dashboard (test + live)
# Copy price IDs to .env.local

# Run development server
npm run dev
```

### Environment Variables

See [.env.example](.env.example) for complete list.

**Critical Variables:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=
STRIPE_SECRET_KEY_TEST=
STRIPE_STARTER_PRICE_TEST=
STRIPE_POPULAR_PRICE_TEST=
STRIPE_PRO_PRICE_TEST=

# Stripe (Live Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=
STRIPE_SECRET_KEY_LIVE=
STRIPE_STARTER_PRICE_LIVE=
STRIPE_POPULAR_PRICE_LIVE=
STRIPE_PRO_PRICE_LIVE=
STRIPE_WEBHOOK_SECRET=

# AI APIs
FASHN_API_KEY=
FASHN_API_ENDPOINT=https://api.fashn.ai/v1
GEMINI_API_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=fitcheck-bucket
R2_PUBLIC_URL= # Optional: custom domain or r2.dev URL

# DataFast
NEXT_PUBLIC_DATAFAST_WEBSITE_ID=

# Domain
NEXT_PUBLIC_APP_DOMAIN=https://www.tryfitcheck.com
```

## 📝 Implementation Status

### ✅ Complete
- ✅ Landing page with premium luxury design
- ✅ Influencer social proof section
- ✅ B2B section
- ✅ **Fashn API v1.6 integration** (fully working with polling)
- ✅ **Google Gemini 2.5 Flash integration** (instant generation)
- ✅ **Credit-based payment system**
- ✅ **Stripe checkout for credit packages**
- ✅ **Stripe webhook handler** (fulfills credits)
- ✅ **Authentication system** (Google, Apple, Email)
- ✅ **Sign up page** (with 3 free credits)
- ✅ **Sign in page**
- ✅ **Protected routes middleware**
- ✅ **Try-on UI with credit system** (deducts 1 credit per generation)
- ✅ **Pricing page** (shows 3 credit packages)
- ✅ **User dashboard** (credit balance, stats, account info)
- ✅ **Database schema** (users, payments, generations)
- ✅ **Auto-credit fulfillment** via database triggers

### 🔧 Needs Configuration
- ⚠️ **Supabase Auth providers** - Configure in Supabase Dashboard
- ⚠️ **Stripe products** - Create in Stripe Dashboard (test + live)
- ⚠️ **Stripe webhook** - Add endpoint URL in Stripe Dashboard
- ⚠️ **DataFast integration** - Connect Stripe to DataFast

### 📋 Next Steps

1. **Set up Supabase:**
   - Run `supabase/setup.sql` in SQL Editor
   - Enable Google OAuth, Apple Sign-In, Email auth
   - Set redirect URLs

2. **Create Stripe Products:**
   - Create 3 products with prices ($5, $10, $25)
   - Copy price IDs to environment variables
   - Do this for both test and live mode

3. **Set up Stripe Webhook:**
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `checkout.session.expired`, `charge.refunded`
   - Copy signing secret to `STRIPE_WEBHOOK_SECRET`

4. **Configure DataFast:**
   - Create website in DataFast
   - Connect Stripe account
   - Copy website ID to `NEXT_PUBLIC_DATAFAST_WEBSITE_ID`

5. **Deploy to Vercel:**
   - Push to GitHub
   - Import to Vercel
   - Add all environment variables
   - Deploy

## 📚 Documentation

- **[supabase/setup.sql](supabase/setup.sql)** - Complete database setup with SQL scripts
- **[docs/STRIPE_DATAFAST_DOC.md](docs/STRIPE_DATAFAST_DOC.md)** - Payment & analytics integration guide
- **[MIGRATION_STATUS.md](MIGRATION_STATUS.md)** - Credit-based migration status and checklist

## 🧪 Testing

### Test Stripe Payments
**Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

**Local Webhook Testing:**
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

### Test User Flow
1. Sign up → Should get 3 free credits
2. Go to try-on → Should see credit balance
3. Upload images and generate → Should deduct 1 credit
4. Go to pricing → Purchase credits
5. Check webhook logs → Credits should be added
6. Dashboard → Should show updated stats

## 🏗 Project Structure

```
tryfitcheck-webapp/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/        # Login page
│   │   └── signup/       # Sign up page
│   ├── (app)/            # Protected app pages
│   │   ├── try-on/       # Virtual try-on interface
│   │   ├── pricing/      # Credit package pricing
│   │   └── dashboard/    # User dashboard
│   ├── (marketing)/      # Public marketing pages
│   │   └── page.tsx      # Landing page
│   ├── api/
│   │   ├── stripe/       # Stripe checkout & webhook
│   │   ├── tryon/        # Try-on generation & status
│   │   └── user/         # User credit balance
│   └── auth/callback/    # OAuth callback handler
├── lib/
│   ├── fashn/            # Fashn API client
│   ├── google-nano/      # Google Gemini client
│   ├── stripe.ts         # Stripe configuration
│   └── supabase/         # Supabase clients
├── components/           # Reusable React components
├── types/               # TypeScript type definitions
├── supabase/            # Database setup scripts
└── middleware.ts        # Auth & route protection
```

## 🔗 Important Links

- **App Store**: https://apps.apple.com/app/id6738919443
- **Google Play**: https://play.google.com/store/apps/details?id=com.wegalabs.fitcheck
- **Website**: https://www.tryfitcheck.com

## 🎨 Design Philosophy

- **Gen-Z Aesthetic**: Pink gradients, modern UI, playful interactions
- **Mobile-First**: Responsive design optimized for all devices
- **Performance**: Optimized images, lazy loading, code splitting
- **Accessibility**: WCAG 2.1 compliant, keyboard navigation

---

**Built with ❤️ for Gen-Z fashionistas**

**Version:** 2.0.0 (Credit-Based System)
**Last Updated:** November 2025
