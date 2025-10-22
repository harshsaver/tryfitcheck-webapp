# Virtual Try-On Implementation Guide

## Overview
This is a **pay-per-use, no-auth** virtual try-on web app. Users pay with Stripe for each generation without creating an account.

## Architecture

### Payment Flow
1. User uploads person image → garment image → selects options
2. Clicks "Generate Try-On" → redirects to Stripe Checkout
3. After payment → redirects back to `/try-on/result?session_id=xxx`
4. Result page calls `/api/generate` with session ID
5. API verifies payment and generates try-on using Fashn API
6. User sees result and can download

### Key Files

#### API Routes
- **`/app/api/checkout/route.ts`** - Creates Stripe checkout session with metadata
- **`/app/api/generate/route.ts`** - Verifies payment and generates try-on

#### Pages
- **`/app/(app)/try-on/page.tsx`** - 3-step flow (person → garment → configure)
- **`/app/(app)/try-on/result/page.tsx`** - Shows generation progress and result

#### Components
- **`/components/try-on/ImageUpload.tsx`** - Reusable upload component with validation

#### Libraries
- **`/lib/stripe.ts`** - Stripe config and pricing
- **`/lib/upload.ts`** - Image validation and upload utilities

## Environment Variables

```bash
# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=pk_test_xxx
STRIPE_SECRET_KEY_TEST=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Stripe (Live Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_xxx
STRIPE_SECRET_KEY_LIVE=sk_live_xxx

# Stripe Mode
STRIPE_MODE=test
NEXT_PUBLIC_STRIPE_MODE=test

# Fashn API
FASHN_API_KEY=fa-xxx
FASHN_API_ENDPOINT=https://api.fashn.ai/v1

# App Domain
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
```

## Pricing

- **Performance**: $0.50 (5s generation)
- **Balanced**: $0.75 (8s generation)
- **Quality**: $1.00 (12s generation)

## Testing Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Stripe**
   - Create account at https://stripe.com
   - Get test API keys from dashboard
   - Add to `.env.local`

3. **Set up Fashn API**
   - Get API key from Fashn
   - Add to `.env.local`

4. **Run dev server**
   ```bash
   npm run dev
   ```

5. **Test with Stripe test cards**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

## Deployment

### Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Stripe Webhooks (Optional for v1)
Not needed for basic pay-per-use flow. Stripe Checkout handles payment verification.

## Image Storage

Currently using base64 encoding (not production-ready). For production, integrate:
- **Vercel Blob** (recommended)
- **Cloudinary**
- **AWS S3**

Update `/lib/upload.ts` → `uploadImageToStorage()` function.

## Future Enhancements (v2)

1. **User Authentication** - Add auth with Supabase
2. **Credit System** - Buy credits in bulk at discount
3. **History** - Save and view past try-ons
4. **Social Sharing** - Share results directly to social media
5. **Webhooks** - Handle payment events properly
6. **Image Storage** - Permanent storage solution

## API Integration

### Fashn API
The app uses Fashn API for virtual try-on generation. Key parameters:
- `model_image`: Person photo URL
- `garment_image`: Garment photo URL
- `category`: tops/bottoms/one-pieces
- `guidance_scale`: Quality setting (2.0-3.0)
- `timesteps`: Speed vs quality (20-50)

See `/app/api/generate/route.ts` for full implementation.

## Troubleshooting

### Build Errors
- Check all environment variables are set
- Make sure Stripe API version matches installed package
- Run `npm run build` to test before deploying

### Payment Issues
- Verify Stripe keys are correct (test vs live)
- Check webhook secret if using webhooks
- Test with Stripe test cards first

### Generation Failures
- Verify Fashn API key is valid
- Check image URLs are accessible
- Review Fashn API docs for limits

## Support

For issues, contact:
- Email: support@tryfitcheck.com
- GitHub: [repo URL]
