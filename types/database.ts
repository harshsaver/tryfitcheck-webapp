// Database types for FitCheck Web App

export interface WebUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  total_generations: number;
  total_credits_purchased: number;
  created_at: string;
  updated_at: string;
}

export interface WebPayment {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  amount_total: number; // in cents
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  credits_purchased: number;
  package_name: string | null; // 'starter', 'popular', 'pro'
  datafast_visitor_id: string | null;
  datafast_session_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WebTryOnGeneration {
  id: string;
  user_id: string | null;
  model_image_url: string;
  garment_image_url: string;
  output_image_url: string | null;
  category: 'tops' | 'bottoms' | 'one-pieces' | 'auto' | null;
  mode: 'performance' | 'balanced' | 'quality';
  ai_provider: 'fashn' | 'google-nano';
  status: 'processing' | 'completed' | 'failed';
  error_message: string | null;
  external_id: string | null; // Fashn prediction ID or Google job ID
  credits_used: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  generation_time_seconds: number | null;
}
