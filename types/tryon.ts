export type TryOnCategory = 'auto' | 'tops' | 'bottoms' | 'one-pieces';
export type TryOnMode = 'performance' | 'balanced' | 'quality';
export type AIProvider = 'fashn' | 'google-nano';
export type TryOnStatus = 'processing' | 'completed' | 'failed';

export interface TryOnRequest {
  modelImage: string; // base64 or URL
  garmentImage: string; // base64 or URL
  category?: TryOnCategory;
  mode?: TryOnMode;
  aiProvider?: AIProvider;
  numSamples?: number;
}

export interface TryOnResponse {
  id: string;
  status: TryOnStatus;
  message?: string;
}

export interface TryOnStatusResponse {
  id: string;
  status: TryOnStatus;
  output?: string[]; // Array of image URLs
  error?: {
    name: string;
    message: string;
  };
  createdAt?: string;
  completedAt?: string | null;
}

export interface UserCredits {
  credits: number;
  totalGenerations: number;
}
