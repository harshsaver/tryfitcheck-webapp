# Vercel Environment Variables Setup

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable below with the corresponding value
4. Select environments: **Production**, **Preview**, and **Development** (or as needed)
5. Click **Save**

## Required Environment Variables

### Supabase
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Public (starts with `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | **Secret** - Server-side only |

### Stripe (Test Mode)
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST` | `pk_test_...` | Public - Test mode |
| `STRIPE_SECRET_KEY_TEST` | `sk_test_...` | **Secret** - Test mode |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | **Secret** - Webhook signing |
| `STRIPE_STARTER_PRICE_TEST` | `price_...` | Test price ID for $5 package |
| `STRIPE_POPULAR_PRICE_TEST` | `price_...` | Test price ID for $10 package |
| `STRIPE_PRO_PRICE_TEST` | `price_...` | Test price ID for $25 package |

### Stripe (Live Mode)
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE` | `pk_live_...` | Public - Live mode |
| `STRIPE_SECRET_KEY_LIVE` | `sk_live_...` | **Secret** - Live mode |
| `STRIPE_STARTER_PRICE_LIVE` | `price_...` | Live price ID for $5 package |
| `STRIPE_POPULAR_PRICE_LIVE` | `price_...` | Live price ID for $10 package |
| `STRIPE_PRO_PRICE_LIVE` | `price_...` | Live price ID for $25 package |

### Fashn API
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `FASHN_API_KEY` | `fa-...` | **Secret** - Fashn API key |
| `FASHN_API_ENDPOINT` | `https://api.fashn.ai/v1` | Public |

### Google Gemini API
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `GOOGLE_GEMINI_API_KEY` | Your Gemini API key | **Secret** |

### Cloudflare R2 (Image Storage) - NEW
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `R2_ACCOUNT_ID` | `0cc173df9904b5ac2fef2dfcabe72a01` | **Secret** - Your R2 account ID |
| `R2_ACCESS_KEY_ID` | `91018b446164f5c95a446dc91363e4cb` | **Secret** - R2 access key |
| `R2_SECRET_ACCESS_KEY` | `23d9e7e75a5a1aafb07acd4a3cfd464972383165c920e13dfbddaac6a87612ff` | **Secret** - R2 secret key |
| `R2_BUCKET_NAME` | `fitcheck-bucket` | Bucket name |
| `R2_PUBLIC_URL` | `https://pub-5bf4ffac2c2c40f7b0acbcf7d8d89951.r2.dev` | Public URL for bucket |

### DataFast Analytics
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_DATAFAST_WEBSITE_ID` | `dfid_8dDTTY4SDh54x43CILUSu` | Public |
| `NEXT_PUBLIC_DATAFAST_DOMAIN` | `tryfitcheck.com` | Public |

### App Configuration
| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_APP_DOMAIN` | `https://www.tryfitcheck.com` | Public - Production domain |
| `NEXT_PUBLIC_IOS_APP_URL` | `https://apps.apple.com/app/id6738919443` | Public |
| `NEXT_PUBLIC_ANDROID_APP_URL` | `https://play.google.com/store/apps/details?id=com.wegalabs.fitcheck` | Public |

## Environment-Specific Values

### For **Production**:
- Use **live** Stripe keys (`pk_live_...`, `sk_live_...`)
- Use **live** Stripe price IDs
- Use production domain: `https://www.tryfitcheck.com`

### For **Preview** (Staging):
- Use **test** Stripe keys (`pk_test_...`, `sk_test_...`)
- Use **test** Stripe price IDs
- Use preview domain or keep as production domain

### For **Development** (Local):
- Use **test** Stripe keys
- Use **test** Stripe price IDs
- Use `http://localhost:3000` for domain (optional)

## Quick Copy-Paste Format

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=
STRIPE_SECRET_KEY_TEST=
STRIPE_WEBHOOK_SECRET=
STRIPE_STARTER_PRICE_TEST=
STRIPE_POPULAR_PRICE_TEST=
STRIPE_PRO_PRICE_TEST=

# Stripe (Live)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=
STRIPE_SECRET_KEY_LIVE=
STRIPE_STARTER_PRICE_LIVE=
STRIPE_POPULAR_PRICE_LIVE=
STRIPE_PRO_PRICE_LIVE=

# Fashn API
FASHN_API_KEY=
FASHN_API_ENDPOINT=https://api.fashn.ai/v1

# Google Gemini
GOOGLE_GEMINI_API_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=0cc173df9904b5ac2fef2dfcabe72a01
R2_ACCESS_KEY_ID=91018b446164f5c95a446dc91363e4cb
R2_SECRET_ACCESS_KEY=23d9e7e75a5a1aafb07acd4a3cfd464972383165c920e13dfbddaac6a87612ff
R2_BUCKET_NAME=fitcheck-bucket
R2_PUBLIC_URL=https://pub-5bf4ffac2c2c40f7b0acbcf7d8d89951.r2.dev

# DataFast
NEXT_PUBLIC_DATAFAST_WEBSITE_ID=dfid_8dDTTY4SDh54x43CILUSu
NEXT_PUBLIC_DATAFAST_DOMAIN=tryfitcheck.com

# App Config
NEXT_PUBLIC_APP_DOMAIN=https://www.tryfitcheck.com
NEXT_PUBLIC_IOS_APP_URL=https://apps.apple.com/app/id6738919443
NEXT_PUBLIC_ANDROID_APP_URL=https://play.google.com/store/apps/details?id=com.wegalabs.fitcheck
```

## Important Notes

1. **Secret variables** (without `NEXT_PUBLIC_` prefix) are only accessible server-side
2. **Public variables** (with `NEXT_PUBLIC_` prefix) are embedded in the client bundle
3. After adding variables, **redeploy** your project for changes to take effect
4. For webhook endpoints, make sure to update Stripe webhook URL to your Vercel domain:
   - `https://www.tryfitcheck.com/api/stripe/webhook`

## Vercel Environment Selection

The app automatically detects the environment:
- `NEXT_PUBLIC_VERCEL_ENV=production` → Uses live Stripe keys
- `NEXT_PUBLIC_VERCEL_ENV=preview` → Uses test Stripe keys
- `NEXT_PUBLIC_VERCEL_ENV=development` → Uses test Stripe keys

## Testing After Deployment

1. Check environment variables are loaded:
   ```bash
   # In Vercel Function Logs
   console.log(process.env.R2_ACCOUNT_ID) // Should NOT be undefined
   ```

2. Test image upload in `/try-on` page
3. Verify images appear in R2 bucket
4. Check image URLs are accessible via public URL

## Troubleshooting

### "Invalid supabaseUrl" error
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly in Vercel

### "Upload failed" error
- Check all R2 environment variables are set
- Verify R2 bucket has public access enabled
- Check CORS policy is configured

### Images not loading
- Verify `R2_PUBLIC_URL` is correct
- Check bucket public access settings
- Verify CORS allows your domain

---

**Last Updated:** November 10, 2025
