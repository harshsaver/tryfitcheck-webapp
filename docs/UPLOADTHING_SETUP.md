# UploadThing Setup Guide

Complete guide for implementing UploadThing image storage in FitCheck Web App.

## Overview

**UploadThing** is used for all image storage in FitCheck Web App:
- ✅ Person photos (user uploads)
- ✅ Garment photos (user uploads or URLs)
- ✅ Generated try-on results (AI outputs)

**Architecture:**
- Images stored on **UploadThing CDN**
- Image URLs stored in **Supabase database**
- Fast, scalable, and cost-effective

---

## Prerequisites

- [ ] UploadThing account created
- [ ] UploadThing token obtained
- [ ] UploadThing app ID obtained

---

## Step 1: Get UploadThing Credentials

### 1.1 Create Account

1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up with GitHub or email
3. Create a new app

### 1.2 Get API Credentials

1. Go to [Dashboard](https://uploadthing.com/dashboard)
2. Click on your app
3. Go to **API Keys** tab
4. Copy:
   - **Token** (starts with `sk_live_...` or `sk_test_...`)
   - **App ID** (your app identifier)

### 1.3 Add to Environment Variables

You already have these in Vercel:
```bash
UPLOADTHING_TOKEN=sk_live_xxxxx
UPLOADTHING_APP_ID=your_app_id
```

For local development, add to `.env.local`:
```bash
UPLOADTHING_TOKEN=sk_test_xxxxx  # Use test key for development
UPLOADTHING_APP_ID=your_app_id
```

---

## Step 2: Installation (Already Done)

Packages installed:
```bash
npm install uploadthing @uploadthing/react
```

---

## Step 3: File Router Configuration (Already Done)

File router created at **`app/api/uploadthing/core.ts`** with 3 endpoints:

### 3.1 Person Image Uploader
- **Route**: `personImageUploader`
- **Max Size**: 10MB
- **Usage**: User uploads their photo for try-on
- **Returns**: UploadThing URL

### 3.2 Garment Image Uploader
- **Route**: `garmentImageUploader`
- **Max Size**: 10MB
- **Usage**: User uploads garment photo
- **Returns**: UploadThing URL

### 3.3 Result Image Uploader (Internal)
- **Route**: `resultImageUploader`
- **Max Size**: 10MB
- **Usage**: Server-side upload of AI-generated results
- **Returns**: UploadThing URL

---

## Step 4: API Route Handler (Already Done)

Route handler created at **`app/api/uploadthing/route.ts`**

**Endpoint**: `POST /api/uploadthing`

---

## Step 5: React Helpers (Already Done)

Helpers exported from **`lib/uploadthing.ts`**:

```typescript
import { UploadButton, UploadDropzone, useUploadThing } from "@/lib/uploadthing";
```

---

## Usage Examples

### Example 1: Using UploadButton Component

```typescript
"use client";

import { UploadButton } from "@/lib/uploadthing";

export default function MyComponent() {
  return (
    <UploadButton
      endpoint="personImageUploader"
      onClientUploadComplete={(res) => {
        console.log("Files uploaded:", res);
        const imageUrl = res[0].url;
        // Save imageUrl to state or database
      }}
      onUploadError={(error) => {
        console.error("Upload error:", error);
        alert(`Upload failed: ${error.message}`);
      }}
    />
  );
}
```

### Example 2: Using UploadDropzone Component

```typescript
"use client";

import { UploadDropzone } from "@/lib/uploadthing";

export default function MyComponent() {
  return (
    <UploadDropzone
      endpoint="garmentImageUploader"
      onClientUploadComplete={(res) => {
        const imageUrl = res[0].url;
        console.log("Garment uploaded:", imageUrl);
      }}
      onUploadError={(error) => {
        alert(`Upload failed: ${error.message}`);
      }}
    />
  );
}
```

### Example 3: Using useUploadThing Hook (Advanced)

```typescript
"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export default function CustomUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload, isUploading } = useUploadThing("personImageUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload complete:", res);
      const imageUrl = res[0].url;
      // Handle uploaded image URL
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const handleUpload = async () => {
    if (files.length > 0) {
      await startUpload(files);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setFiles([file]);
        }}
      />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
```

### Example 4: Server-Side Upload (For AI Results)

```typescript
// app/api/generate/route.ts
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  // ... generate AI result ...
  const resultImageBlob = await fetch(aiGeneratedImageUrl).then(r => r.blob());

  // Upload to UploadThing
  const uploadedFile = await utapi.uploadFiles(
    new File([resultImageBlob], "result.jpg", { type: "image/jpeg" })
  );

  const uploadThingUrl = uploadedFile.data.url;

  // Save uploadThingUrl to database
  return Response.json({ resultUrl: uploadThingUrl });
}
```

---

## Integration with Try-On Flow

### Flow Diagram

```
1. User uploads person photo
   ↓
   Upload to UploadThing (personImageUploader)
   ↓
   Get UploadThing URL
   ↓
   Save URL in state

2. User uploads garment photo
   ↓
   Upload to UploadThing (garmentImageUploader)
   ↓
   Get UploadThing URL
   ↓
   Save URL in state

3. User clicks "Generate"
   ↓
   Send both UploadThing URLs to /api/generate
   ↓
   API calls Fashn/Nano Banana with URLs
   ↓
   AI returns generated image URL
   ↓
   (Optional) Upload AI result to UploadThing
   ↓
   Save generation record to Supabase with all URLs
```

### Updated ImageUpload Component

The `ImageUpload` component should be updated to use UploadThing:

```typescript
"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { validateImage } from "@/lib/upload";

interface ImageUploadProps {
  endpoint: "personImageUploader" | "garmentImageUploader";
  onImageUploaded: (url: string) => void;
}

export default function ImageUpload({ endpoint, onImageUploaded }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const imageUrl = res[0].url;
      onImageUploaded(imageUrl);
      setIsUploading(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFile = async (file: File) => {
    // Validate
    const validation = validateImage(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to UploadThing
    setIsUploading(true);
    await startUpload([file]);
  };

  // ... rest of drag & drop UI ...
}
```

---

## Database Schema Updates

### web_tryon_generations Table

```sql
-- Input images are UploadThing URLs
person_image_url TEXT NOT NULL,      -- e.g., https://utfs.io/f/abc123.jpg
garment_image_url TEXT NOT NULL,     -- e.g., https://utfs.io/f/def456.jpg

-- Output can be UploadThing URL or AI provider URL
output_image_url TEXT,               -- e.g., https://utfs.io/f/ghi789.jpg
```

**Note:** AI providers (Fashn, Nano Banana) return temporary URLs. You can either:
1. Store AI URL directly (expires after ~24 hours)
2. Download and re-upload to UploadThing for permanent storage (recommended for production)

---

## File Size Limits & Pricing

### UploadThing Limits

**Free Tier:**
- 2GB storage
- 2GB bandwidth/month
- Good for testing

**Pro Plan ($20/month):**
- 100GB storage
- 100GB bandwidth/month
- Custom domains
- More concurrent uploads

**Recommended for Production:** Start with Free tier, upgrade when needed.

### Our Configuration

- **Max file size**: 10MB per image
- **Allowed formats**: JPG, PNG, WebP
- **Expected usage**: ~100-500 uploads/day initially

---

## Security Considerations

### Authentication (Optional)

Currently, authentication is **optional** in the middleware. For production, you can:

**Option 1:** Require auth for all uploads
```typescript
.middleware(async ({ req }) => {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new UploadThingError("Unauthorized");

  return { userId: user.id };
})
```

**Option 2:** Allow anonymous uploads (current)
```typescript
.middleware(async ({ req }) => {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return { userId: user?.id || "anonymous" };
})
```

### File Validation

Already configured:
- ✅ Max file size: 10MB
- ✅ File type: Images only
- ✅ Max file count: 1 per upload

---

## Testing

### Test Upload Locally

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Navigate to a page with `UploadButton` or `UploadDropzone`

3. Upload a test image

4. Check console for uploaded URL

5. Visit the URL to verify image is accessible

### Test in Vercel

1. Deploy to Vercel
2. Ensure environment variables are set
3. Test upload flow
4. Verify URLs are accessible

---

## Troubleshooting

### Issue: "Invalid UploadThing Token"

**Solution:**
- Verify `UPLOADTHING_TOKEN` is set correctly in `.env.local` and Vercel
- Make sure you're using the correct token (test vs live)
- Regenerate token from UploadThing dashboard

### Issue: Upload fails with CORS error

**Solution:**
- Check that your domain is allowed in UploadThing dashboard
- Add `tryfitcheck.com` and `localhost:3000` to allowed origins

### Issue: Files not uploading

**Solution:**
- Check file size (must be < 10MB)
- Check file type (must be image)
- Check browser console for errors
- Verify endpoint name matches file router

---

## Monitoring & Analytics

### UploadThing Dashboard

Monitor usage at [uploadthing.com/dashboard](https://uploadthing.com/dashboard):
- Total uploads
- Storage used
- Bandwidth used
- Upload success/failure rates

### Recommended Alerts

Set up alerts for:
- Storage usage > 80%
- Bandwidth usage > 80%
- Unusual spike in uploads

---

## Next Steps

1. ✅ UploadThing configured
2. ✅ File router created
3. ✅ React helpers exported
4. → Update `ImageUpload.tsx` to use UploadThing
5. → Test upload flow
6. → Deploy to Vercel
7. → Monitor usage

---

## Additional Resources

- [UploadThing Docs](https://docs.uploadthing.com/)
- [Next.js App Router Guide](https://docs.uploadthing.com/getting-started/appdir)
- [React Helpers Guide](https://docs.uploadthing.com/api-reference/react)
- [Server SDK](https://docs.uploadthing.com/api-reference/server)

---

**UploadThing Setup Complete!** ✅

All images will now be stored on UploadThing CDN with URLs saved to Supabase database.
