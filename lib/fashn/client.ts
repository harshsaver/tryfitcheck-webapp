/**
 * Fashn API Client for Virtual Try-On
 * Based on Fashn Virtual Try-On v1.6 API
 */

export interface FashnTryOnInput {
  modelImage: string; // URL or base64
  garmentImage: string; // URL or base64
  category?: 'auto' | 'tops' | 'bottoms' | 'one-pieces';
  mode?: 'performance' | 'balanced' | 'quality';
  garmentPhotoType?: 'auto' | 'model' | 'flat-lay';
  segmentationFree?: boolean;
  moderationLevel?: 'conservative' | 'permissive' | 'none';
  seed?: number;
  numSamples?: number;
  outputFormat?: 'png' | 'jpeg';
  returnBase64?: boolean;
}

export interface FashnPredictionResponse {
  id: string;
  error: FashnError | null;
}

export interface FashnStatusResponse {
  id: string;
  status: 'starting' | 'in_queue' | 'processing' | 'completed' | 'failed';
  output?: string[]; // Array of image URLs or base64 strings
  error?: FashnError | null;
}

export interface FashnError {
  name: 'ImageLoadError' | 'ContentModerationError' | 'PoseError' | 'PipelineError' | 'ThirdPartyError';
  message: string;
}

export class FashnAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.FASHN_API_KEY || '';
    this.baseUrl = baseUrl || process.env.FASHN_API_ENDPOINT || 'https://api.fashn.ai/v1';

    if (!this.apiKey) {
      throw new Error('Fashn API key is required');
    }
  }

  /**
   * Initiates a virtual try-on generation
   */
  async createPrediction(input: FashnTryOnInput): Promise<FashnPredictionResponse> {
    const response = await fetch(`${this.baseUrl}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model_name: 'tryon-v1.6',
        inputs: {
          model_image: input.modelImage,
          garment_image: input.garmentImage,
          category: input.category || 'auto',
          mode: input.mode || 'balanced',
          garment_photo_type: input.garmentPhotoType || 'auto',
          segmentation_free: input.segmentationFree ?? true,
          moderation_level: input.moderationLevel || 'permissive',
          seed: input.seed ?? 42,
          num_samples: input.numSamples ?? 1,
          output_format: input.outputFormat || 'png',
          return_base64: input.returnBase64 ?? false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Fashn API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  /**
   * Checks the status of a prediction
   */
  async getPredictionStatus(predictionId: string): Promise<FashnStatusResponse> {
    const response = await fetch(`${this.baseUrl}/status/${predictionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Fashn status check failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Polls until prediction completes (with timeout)
   */
  async waitForCompletion(
    predictionId: string,
    options: { timeout?: number; interval?: number } = {}
  ): Promise<FashnStatusResponse> {
    const timeout = options.timeout || 60000; // 60 seconds default
    const interval = options.interval || 3000; // 3 seconds default
    const startTime = Date.now();

    while (true) {
      if (Date.now() - startTime > timeout) {
        throw new Error('Prediction timeout');
      }

      const status = await this.getPredictionStatus(predictionId);

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  /**
   * Helper method to validate image inputs
   */
  static isBase64Image(input: string): boolean {
    return input.startsWith('data:image/');
  }

  /**
   * Helper method to validate URL inputs
   */
  static isImageUrl(input: string): boolean {
    try {
      const url = new URL(input);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}

// Singleton instance for convenience
let fashnClient: FashnAPIClient | null = null;

export function getFashnClient(): FashnAPIClient {
  if (!fashnClient) {
    fashnClient = new FashnAPIClient();
  }
  return fashnClient;
}
