import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { createClient } from "@/lib/supabase/server";

const f = createUploadthing();

/**
 * UploadThing File Router
 *
 * Handles image uploads for FitCheck web app
 * Images are stored on UploadThing, URLs saved to Supabase
 */

export const ourFileRouter = {
  /**
   * Person Image Uploader
   * Used for uploading user photos for virtual try-on
   */
  personImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Get authenticated user from Supabase
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Auth is optional for uploads, but recommended for production
      // Uncomment below to require auth:
      // if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user?.id || "anonymous",
        imageType: "person"
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Person image upload complete:", file.url);
      console.log("[UploadThing] Uploaded by:", metadata.userId);

      // File URL is automatically available at: file.url
      // No need to save to Supabase here - will be saved when generation is created

      return {
        uploadedBy: metadata.userId,
        imageType: metadata.imageType,
        url: file.url // Return URL to client
      };
    }),

  /**
   * Garment Image Uploader
   * Used for uploading garment/clothing photos for virtual try-on
   */
  garmentImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Auth is optional
      // if (!user) throw new UploadThingError("Unauthorized");

      return {
        userId: user?.id || "anonymous",
        imageType: "garment"
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Garment image upload complete:", file.url);
      console.log("[UploadThing] Uploaded by:", metadata.userId);

      return {
        uploadedBy: metadata.userId,
        imageType: metadata.imageType,
        url: file.url
      };
    }),

  /**
   * Result Image Uploader (Internal Use)
   * Used for uploading generated try-on results from AI APIs
   * Called from server-side only
   */
  resultImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // This route should only be called from server-side
      // Add additional security checks here if needed
      return {
        userId: "system",
        imageType: "result"
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Result image upload complete:", file.url);

      return {
        uploadedBy: metadata.userId,
        imageType: metadata.imageType,
        url: file.url
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
