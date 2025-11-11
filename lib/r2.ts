import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 Storage Client
 *
 * Handles image uploads and retrieval from Cloudflare R2
 * Using AWS S3-compatible API
 */

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME || "fitcheck-bucket";
const PUBLIC_URL = process.env.R2_PUBLIC_URL; // r2.dev URL or custom domain

// Check if R2 is configured
const isR2Configured = !!(ACCOUNT_ID && ACCESS_KEY_ID && SECRET_ACCESS_KEY);

if (!isR2Configured) {
  console.warn('Cloudflare R2 not configured. Image storage features will be unavailable.');
}

// Initialize R2 client with fallback
export const r2Client = isR2Configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID!,
        secretAccessKey: SECRET_ACCESS_KEY!,
      },
    })
  : null;

/**
 * Upload a file to R2 bucket
 * @param file - File buffer or stream
 * @param filename - Unique filename (e.g., user-id/timestamp-uuid.jpg)
 * @param contentType - MIME type (e.g., image/jpeg, image/png)
 * @returns Public URL of uploaded file
 */
export async function uploadToR2(
  file: Buffer | Uint8Array,
  filename: string,
  contentType: string = "image/jpeg"
): Promise<string> {
  if (!r2Client || !isR2Configured) {
    throw new Error("R2 storage is not configured. Please contact support.");
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: file,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Return public URL
    // If you have a custom domain or public r2.dev URL configured:
    if (PUBLIC_URL) {
      return `${PUBLIC_URL}/${filename}`;
    }

    // Otherwise, return a presigned URL (valid for 7 days)
    return await getPresignedUrl(filename, 604800); // 7 days in seconds
  } catch (error) {
    console.error("[R2] Upload error:", error);
    throw new Error("Failed to upload file to R2");
  }
}

/**
 * Generate a presigned URL for accessing a file
 * @param filename - File key in bucket
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedUrl(
  filename: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!r2Client || !isR2Configured) {
    throw new Error("R2 storage is not configured. Please contact support.");
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    return await getSignedUrl(r2Client, command, { expiresIn });
  } catch (error) {
    console.error("[R2] Presigned URL error:", error);
    throw new Error("Failed to generate presigned URL");
  }
}

/**
 * Upload image from URL or base64 to R2
 * @param imageData - Image URL or base64 string
 * @param filename - Unique filename
 * @returns Public URL
 */
export async function uploadImageToR2(
  imageData: string,
  filename: string
): Promise<string> {
  let buffer: Buffer;
  let contentType = "image/jpeg";

  // Handle base64
  if (imageData.startsWith("data:")) {
    const matches = imageData.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid base64 image");

    contentType = matches[1];
    buffer = Buffer.from(matches[2], "base64");
  }
  // Handle URL
  else if (imageData.startsWith("http")) {
    const response = await fetch(imageData);
    if (!response.ok) throw new Error("Failed to fetch image from URL");

    contentType = response.headers.get("content-type") || "image/jpeg";
    buffer = Buffer.from(await response.arrayBuffer());
  }
  // Handle raw buffer
  else {
    throw new Error("Invalid image data format");
  }

  return uploadToR2(buffer, filename, contentType);
}

/**
 * Generate a unique filename for uploads
 * @param userId - User ID (or 'anonymous')
 * @param type - Image type (person, garment, result)
 * @param extension - File extension (default: jpg)
 * @returns Unique filename path
 */
export function generateFilename(
  userId: string,
  type: "person" | "garment" | "result",
  extension: string = "jpg"
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${type}/${userId}/${timestamp}-${random}.${extension}`;
}
