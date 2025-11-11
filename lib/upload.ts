// Image upload utilities

export interface UploadedImage {
  file?: File;
  url: string;
  preview: string;
}

// Validate image file
export function validateImage(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPG, PNG, or WebP image' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 10MB' };
  }

  return { valid: true };
}

// Upload image to R2 storage
export async function uploadImageToStorage(
  file: File,
  type: 'person' | 'garment' | 'result' = 'person'
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Validate URL format
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must use HTTP or HTTPS' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// Create image preview
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
