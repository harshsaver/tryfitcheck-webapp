# Cloudflare R2 Environment Variables

## Quick Reference - Exact Variable Names for Vercel

Add these **5 environment variables** to your Vercel project:

### Variable Names & Values

| Variable Name | Your Value | Environment |
|--------------|-----------|-------------|
| `R2_ACCOUNT_ID` | `0cc173df9904b5ac2fef2dfcabe72a01` | All (Production, Preview, Development) |
| `R2_ACCESS_KEY_ID` | `91018b446164f5c95a446dc91363e4cb` | All |
| `R2_SECRET_ACCESS_KEY` | `23d9e7e75a5a1aafb07acd4a3cfd464972383165c920e13dfbddaac6a87612ff` | All |
| `R2_BUCKET_NAME` | `fitcheck-bucket` | All |
| `R2_PUBLIC_URL` | `https://pub-5bf4ffac2c2c40f7b0acbcf7d8d89951.r2.dev` | All |

## How to Add to Vercel

### Method 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your project: `tryfitcheck-webapp`
3. Go to **Settings** → **Environment Variables**
4. For each variable:
   - **Key**: Copy exact name from table above
   - **Value**: Copy corresponding value
   - **Environments**: Select all 3 (Production, Preview, Development)
   - Click **Add**
5. After adding all 5 variables, **redeploy** your project

### Method 2: Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Add environment variables
vercel env add R2_ACCOUNT_ID
# When prompted, paste: 0cc173df9904b5ac2fef2dfcabe72a01
# Select: Production, Preview, Development

vercel env add R2_ACCESS_KEY_ID
# When prompted, paste: 91018b446164f5c95a446dc91363e4cb

vercel env add R2_SECRET_ACCESS_KEY
# When prompted, paste: 23d9e7e75a5a1aafb07acd4a3cfd464972383165c920e13dfbddaac6a87612ff

vercel env add R2_BUCKET_NAME
# When prompted, paste: fitcheck-bucket

vercel env add R2_PUBLIC_URL
# When prompted, paste: https://pub-5bf4ffac2c2c40f7b0acbcf7d8d89951.r2.dev

# Redeploy
vercel --prod
```

## Important Notes

### Security
✅ **All R2 variables are server-side only** (no `NEXT_PUBLIC_` prefix)
- They are NOT exposed in the client bundle
- Only accessible in API routes and server components
- Safe to use with sensitive credentials

### Variable Usage in Code
These variables are used in:
- `lib/r2.ts` - R2 client initialization
- `app/api/upload/route.ts` - Image upload endpoint

### After Adding Variables
1. **Redeploy** your project (variables only apply to new deployments)
2. Test image upload at `/try-on`
3. Verify images appear in R2 bucket
4. Check that image URLs work in browser

## Verification Checklist

After deployment, verify:
- [ ] All 5 variables are added in Vercel dashboard
- [ ] Variables are set for all environments (Production, Preview, Development)
- [ ] Project has been redeployed after adding variables
- [ ] Image upload works in `/try-on` page
- [ ] Uploaded images are accessible via public URL
- [ ] Images appear in R2 bucket dashboard

## Troubleshooting

### "R2_ACCOUNT_ID is undefined" error
→ Variable not set in Vercel, or deployment is using old build

### "Upload failed" error
→ Check all 5 variables are set correctly with no typos

### Images upload but don't load
→ Verify `R2_PUBLIC_URL` is correct and bucket has public access enabled

### CORS error
→ Verify CORS policy is configured in R2 bucket settings (already done ✅)

## R2 Configuration Status

✅ **Completed:**
- R2 bucket created: `fitcheck-bucket`
- Access keys generated
- Public development URL enabled: `https://pub-5bf4ffac2c2c40f7b0acbcf7d8d89951.r2.dev`
- CORS policy configured (allows all origins)

⚠️ **Pending:**
- Add environment variables to Vercel
- Deploy and test

## What Happens When User Uploads Image

1. User selects image in `/try-on` page
2. Image is uploaded to `/api/upload` endpoint
3. API route uses R2 credentials to upload to bucket
4. File is stored at: `{type}/{userId}/{timestamp}-{random}.{ext}`
5. Public URL is returned: `https://pub-5bf4ffac2c2c40f7b0acbcf7d8d89951.r2.dev/{path}`
6. Image URL is used in try-on generation API
7. AI processes the image and generates result
8. Result is also stored in R2

## Cost Estimate

Based on your usage:
- **Storage**: 10GB free, then $0.015/GB/month
- **Requests**: 10M reads/month free (plenty for images)
- **Egress**: $0 (no bandwidth fees!)

Example with 1000 images (100MB each):
- Total storage: 100GB
- Cost: (100GB - 10GB free) × $0.015 = **$1.35/month**

Compare to UploadThing: ~$200/month for same usage 🎉

---

**Ready to deploy?** Add these variables to Vercel and redeploy!
