# Migration from UploadThing to Cloudflare R2

## Overview
Successfully migrated image storage from UploadThing to Cloudflare R2 to reduce storage costs and improve scalability.

## What Changed

### 1. **Packages**
- ❌ Removed: `uploadthing`, `@uploadthing/react`
- ✅ Added: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`

### 2. **New Files Created**
- `lib/r2.ts` - R2 client and upload utilities
- `app/api/upload/route.ts` - New upload endpoint for R2
- `.env.local.r2` - R2 credentials reference

### 3. **Files Removed**
- `lib/uploadthing.ts`
- `app/api/uploadthing/core.ts`
- `app/api/uploadthing/route.ts`
- `docs/UPLOADTHING_SETUP.md`

### 4. **Files Updated**
- `lib/upload.ts` - Updated `uploadImageToStorage()` to use R2
- `app/(app)/try-on/page.tsx` - Pass image type to upload function
- `.env.example` - Replaced UploadThing vars with R2 vars
- `.env.local` - Added R2 credentials (backup saved)
- `readme.md` - Updated documentation

## Environment Variables

### Old (UploadThing)
```bash
UPLOADTHING_TOKEN=your_token_here
UPLOADTHING_APP_ID=your_app_id_here
```

### New (Cloudflare R2)
```bash
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=fitcheck-bucket
R2_PUBLIC_URL=https://pub-5bf4ffac2c2c40f7b0acbcf7d8d89951.r2.dev
```

**Security Note:** These are server-side variables only (no `NEXT_PUBLIC_` prefix). Add them to Vercel's environment variables dashboard. See [VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md) for complete setup guide.

## How It Works

### Upload Flow
1. User uploads image in `/try-on` page
2. `uploadImageToStorage(file, type)` is called (from `lib/upload.ts`)
3. File is sent to `/api/upload` endpoint
4. API route uploads to R2 using AWS S3 SDK
5. Returns public URL (presigned or custom domain)

### Image Types
- `person` - User photos for try-on
- `garment` - Clothing images
- `result` - AI-generated results

### File Storage Structure
```
fitcheck-bucket/
├── person/
│   ├── {userId}/
│   │   └── {timestamp}-{random}.jpg
├── garment/
│   └── {userId}/
│       └── {timestamp}-{random}.jpg
└── result/
    └── {userId}/
        └── {timestamp}-{random}.png
```

## API Changes

### New Upload Endpoint: `/api/upload`

**Request:**
```bash
POST /api/upload
Content-Type: multipart/form-data

file: File
type: "person" | "garment" | "result"
```

**Response:**
```json
{
  "success": true,
  "url": "https://...",
  "uploadedBy": "user-id",
  "imageType": "person"
}
```

## Public Access Configuration

### Option 1: r2.dev Subdomain (✅ Configured)
1. ✅ Cloudflare Dashboard → R2 → fitcheck-bucket → Settings
2. ✅ Enabled "Public Development URL"
3. ✅ URL: `https://pub-5bf4ffac2c2c40f7b0acbcf7d8d89951.r2.dev`
4. ✅ Added to environment variables

### Option 2: Custom Domain (Optional - For Production)
1. Cloudflare Dashboard → R2 → fitcheck-bucket → Settings
2. Custom Domains → Connect Domain
3. Enter your domain (e.g., `cdn.tryfitcheck.com`)
4. DNS record will be added automatically
5. Update `R2_PUBLIC_URL` in Vercel environment variables

### CORS Configuration (✅ Configured)
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## Testing

### 1. Check Environment Variables
```bash
cat .env.local | grep R2
```

### 2. Test Upload Endpoint
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test-image.jpg" \
  -F "type=person"
```

### 3. Test in Browser
1. Run `npm run dev`
2. Go to `/try-on`
3. Upload person and garment images
4. Check browser console for R2 upload logs
5. Verify images are accessible via returned URLs

### 4. Verify R2 Bucket
1. Go to Cloudflare Dashboard → R2 → fitcheck-bucket
2. Check that images appear in correct folders
3. View file details to confirm upload

## Cost Comparison

### UploadThing
- Free tier: 2GB storage, 2GB transfer/month
- Paid: $20/month for 10GB storage + transfer
- **Issue:** Running out of space

### Cloudflare R2
- Free tier: 10GB storage, 10M read requests/month
- Storage: $0.015/GB/month (beyond 10GB)
- No egress fees (huge savings!)
- **Benefit:** Much more generous free tier + scalable

### Example Calculation (100GB)
- UploadThing: ~$200/month
- R2: $1.50/month storage + $0 egress = **$1.50/month**
- **Savings: 99.25%** 🎉

## Rollback Plan

If you need to rollback to UploadThing:

1. **Restore packages:**
```bash
npm install uploadthing @uploadthing/react
```

2. **Restore files from git:**
```bash
git checkout HEAD~1 -- lib/uploadthing.ts app/api/uploadthing/
```

3. **Restore environment variables:**
```bash
# In .env.local, replace R2 vars with:
UPLOADTHING_TOKEN=your_token
UPLOADTHING_APP_ID=your_app_id
```

4. **Revert upload function:**
Update `lib/upload.ts` to use UploadThing again.

## Next Steps

1. ✅ Migration complete
2. ⚠️ Configure public access (r2.dev or custom domain)
3. ⚠️ Update Vercel environment variables (when deploying)
4. ⚠️ Test in production environment
5. ⚠️ Monitor R2 usage in Cloudflare Dashboard
6. ⚠️ (Optional) Migrate existing images from UploadThing to R2

## Support

- **R2 Docs:** https://developers.cloudflare.com/r2/
- **AWS S3 SDK:** https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/
- **Issue Tracker:** https://github.com/anthropics/claude-code/issues

---

**Migration completed:** November 10, 2025
**Status:** ✅ Ready for testing
