import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToR2, generateFilename } from "@/lib/r2";

/**
 * Image Upload API Route
 *
 * Handles image uploads to Cloudflare R2
 * Supports both person and garment images for virtual try-on
 */

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user (optional)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "anonymous";

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const imageType = formData.get("type") as "person" | "garment" | "result";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!imageType || !["person", "garment", "result"].includes(imageType)) {
      return NextResponse.json(
        { error: "Invalid image type. Must be 'person', 'garment', or 'result'" },
        { status: 400 }
      );
    }

    // Validate file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 8MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const extension = file.type.split("/")[1] || "jpg";
    const filename = generateFilename(userId, imageType, extension);

    // Upload to R2
    const url = await uploadToR2(buffer, filename, file.type);

    console.log(`[Upload] ${imageType} image uploaded:`, url);

    return NextResponse.json({
      success: true,
      url,
      uploadedBy: userId,
      imageType,
    });
  } catch (error) {
    console.error("[Upload] Error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check upload status or get presigned URLs
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Upload API is working. Use POST to upload images.",
    maxFileSize: "8MB",
    supportedTypes: ["person", "garment", "result"],
  });
}
