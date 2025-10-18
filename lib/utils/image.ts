/**
 * Image preprocessing utilities for Fashn API
 * Follows Fashn best practices: resize to max 2000px height, convert to JPEG at 95% quality
 */

import sharp from 'sharp';

export interface ImageProcessingOptions {
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png';
}

/**
 * Processes an image buffer to optimize for Fashn API
 * @param buffer - Image buffer from file upload
 * @param options - Processing options
 * @returns Processed image buffer
 */
export async function processImageBuffer(
  buffer: Buffer,
  options: ImageProcessingOptions = {}
): Promise<Buffer> {
  const { maxHeight = 2000, quality = 95, format = 'jpeg' } = options;

  try {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    let processedImage = image;

    // Resize if height exceeds maxHeight
    if (metadata.height && metadata.height > maxHeight) {
      processedImage = processedImage.resize({
        height: maxHeight,
        fit: 'inside', // Maintain aspect ratio
        withoutEnlargement: true,
      });
    }

    // Convert to specified format
    if (format === 'jpeg') {
      processedImage = processedImage.jpeg({
        quality,
        mozjpeg: true, // Use mozjpeg for better compression
      });
    } else {
      processedImage = processedImage.png({
        compressionLevel: 9,
      });
    }

    return processedImage.toBuffer();
  } catch (error) {
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Converts image buffer to base64 string with proper prefix
 * @param buffer - Image buffer
 * @param mimeType - MIME type (e.g., 'image/jpeg', 'image/png')
 * @returns Base64 string with data URI prefix
 */
export function bufferToBase64(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Processes a base64 image string
 * @param base64String - Base64 image string (with or without prefix)
 * @param options - Processing options
 * @returns Processed base64 string with prefix
 */
export async function processBase64Image(
  base64String: string,
  options: ImageProcessingOptions = {}
): Promise<string> {
  // Remove data URI prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const processedBuffer = await processImageBuffer(buffer, options);
  const format = options.format || 'jpeg';
  const mimeType = `image/${format}`;

  return bufferToBase64(processedBuffer, mimeType);
}

/**
 * Validates image file size
 * @param buffer - Image buffer
 * @param maxSizeMB - Maximum size in megabytes
 * @returns true if valid, false otherwise
 */
export function validateImageSize(buffer: Buffer, maxSizeMB: number = 10): boolean {
  const sizeMB = buffer.length / (1024 * 1024);
  return sizeMB <= maxSizeMB;
}

/**
 * Validates image dimensions
 * @param buffer - Image buffer
 * @param options - Dimension constraints
 * @returns Promise<boolean>
 */
export async function validateImageDimensions(
  buffer: Buffer,
  options: { minWidth?: number; minHeight?: number; maxWidth?: number; maxHeight?: number } = {}
): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata();
    const { width = 0, height = 0 } = metadata;

    if (options.minWidth && width < options.minWidth) return false;
    if (options.minHeight && height < options.minHeight) return false;
    if (options.maxWidth && width > options.maxWidth) return false;
    if (options.maxHeight && height > options.maxHeight) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Gets image metadata
 * @param buffer - Image buffer
 * @returns Image metadata
 */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata();
}

/**
 * Converts a File object to Buffer (for server-side processing)
 * @param file - File object
 * @returns Buffer
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Download image from URL and return buffer
 * @param url - Image URL
 * @returns Image buffer
 */
export async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    throw new Error(`Image download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
