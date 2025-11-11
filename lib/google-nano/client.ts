/**
 * Google Gemini Image Generation API Client
 * Uses gemini-2.5-flash-image model for virtual try-on
 * Documentation: https://ai.google.dev/gemini-api/docs/image-generation
 */

export interface GeminiTryOnInput {
  modelImage: string; // base64 or URL
  garmentImage: string; // base64 or URL
  category?: 'tops' | 'bottoms' | 'one-pieces';
  prompt?: string; // Custom prompt override
}

export interface GeminiGenerationResponse {
  id: string; // We generate this client-side
  output?: string; // base64 image
  error?: {
    name: string;
    message: string;
  } | null;
}

export interface GeminiStatusResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  output?: string[];
  error?: any;
}

export class GoogleGeminiImageClient {
  private apiKey: string;
  private baseUrl: string;
  private modelName: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.modelName = 'gemini-2.5-flash-image';

    if (!this.apiKey) {
      console.warn('Gemini API key not configured. Gemini try-on features will be unavailable.');
    }
  }

  /**
   * Generate a virtual try-on image using Gemini
   * Note: Gemini doesn't have async jobs, so this completes immediately
   */
  async createPrediction(input: GeminiTryOnInput): Promise<GeminiGenerationResponse> {
    const predictionId = `gemini_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    if (!this.apiKey) {
      return {
        id: predictionId,
        error: {
          name: 'ConfigurationError',
          message: 'Gemini API key is not configured. Please contact support.',
        },
      };
    }

    try {
      // Convert images to base64 if they're URLs
      const modelImageBase64 = await this.imageToBase64(input.modelImage);
      const garmentImageBase64 = await this.imageToBase64(input.garmentImage);

      // Build the prompt
      const prompt = input.prompt || this.buildTryOnPrompt(input.category);

      // Prepare the request payload
      const payload = {
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: modelImageBase64,
                },
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: garmentImageBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        },
      };

      const response = await fetch(
        `${this.baseUrl}/${this.modelName}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();

      // Extract the generated image from response
      // Gemini returns text by default, we need to parse for image data
      const generatedImage = this.extractImageFromResponse(data);

      if (!generatedImage) {
        throw new Error('No image data returned from Gemini API');
      }

      return {
        id: predictionId,
        output: generatedImage,
        error: null,
      };
    } catch (error: any) {
      console.error('[Gemini] Generation error:', error);
      return {
        id: predictionId,
        error: {
          name: 'GenerationError',
          message: error.message || 'Failed to generate image with Gemini',
        },
      };
    }
  }

  /**
   * Check status of a prediction (for API compatibility)
   * Note: Gemini doesn't have async jobs, so this is instant
   */
  async getPredictionStatus(predictionId: string): Promise<GeminiStatusResponse> {
    // Gemini API doesn't support status polling
    // This is just for API compatibility with Fashn
    return {
      id: predictionId,
      status: 'completed',
      output: [],
    };
  }

  /**
   * Build a prompt for virtual try-on
   */
  private buildTryOnPrompt(category?: string): string {
    const categoryText = category ? ` The garment is a ${category.replace('-', ' ')}.` : '';

    return `You are a professional virtual try-on AI. Using the two images provided:
1. The first image shows a person
2. The second image shows a garment/clothing item

Create a photorealistic image showing the person from the first image wearing the garment from the second image.${categoryText}

Requirements:
- Maintain the person's body proportions, skin tone, and facial features exactly as shown
- Fit the garment naturally on the person's body with realistic draping and shadows
- Preserve the garment's color, pattern, texture, and style exactly as shown
- Ensure proper lighting and shadows that match the original person image
- Make it look like a professional e-commerce fashion photograph
- The background should remain similar to the original person image
- Pay attention to garment details like buttons, zippers, collars, and seams

The final result should look completely natural and realistic, as if the person is actually wearing the garment in a professional photoshoot.`;
  }

  /**
   * Convert image to base64 (handles both URLs and base64)
   */
  private async imageToBase64(image: string): Promise<string> {
    // If already base64, extract the data part
    if (image.startsWith('data:image/')) {
      return image.split(',')[1];
    }

    // If it's a URL, fetch and convert
    if (image.startsWith('http://') || image.startsWith('https://')) {
      try {
        const response = await fetch(image);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString('base64');
      } catch (error) {
        throw new Error(`Failed to fetch image from URL: ${image}`);
      }
    }

    // Assume it's already base64 without the data URI prefix
    return image;
  }

  /**
   * Extract image data from Gemini API response
   */
  private extractImageFromResponse(response: any): string | null {
    try {
      // Gemini response structure:
      // response.candidates[0].content.parts[0].inline_data.data
      if (
        response.candidates &&
        response.candidates[0] &&
        response.candidates[0].content &&
        response.candidates[0].content.parts
      ) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inline_data && part.inline_data.data) {
            // Return as data URI
            const mimeType = part.inline_data.mime_type || 'image/jpeg';
            return `data:${mimeType};base64,${part.inline_data.data}`;
          }
        }
      }

      // Alternative: Check if there's text that describes an image URL
      if (
        response.candidates &&
        response.candidates[0] &&
        response.candidates[0].content &&
        response.candidates[0].content.parts
      ) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            // Check if text contains a URL or base64 image
            const urlMatch = part.text.match(/https?:\/\/[^\s]+/);
            if (urlMatch) {
              return urlMatch[0];
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error('[Gemini] Failed to extract image from response:', error);
      return null;
    }
  }

  /**
   * Validate image input format
   */
  static isValidImageInput(input: string): boolean {
    return (
      input.startsWith('data:image/') ||
      input.startsWith('http://') ||
      input.startsWith('https://')
    );
  }
}

// Singleton instance
let geminiClient: GoogleGeminiImageClient | null = null;

export function getGeminiClient(): GoogleGeminiImageClient {
  if (!geminiClient) {
    geminiClient = new GoogleGeminiImageClient();
  }
  return geminiClient;
}
