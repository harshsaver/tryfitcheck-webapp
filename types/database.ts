export interface WebUser {
  id: string;
  email: string;
  credits: number;
  total_generations: number;
  created_at: string;
  updated_at: string;
}

export interface WebPayment {
  user_id: string;
  stripe_customer_id: string | null;
  subscription_id: string | null;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete' | 'incomplete_expired';
  plan_type: string | null;
  credits_purchased: number | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface WebTryonGeneration {
  id: string;
  user_id: string | null;
  model_image_url: string;
  garment_image_url: string;
  output_image_url: string | null;
  category: string | null;
  mode: string;
  ai_provider: 'fashn' | 'google-nano';
  status: 'processing' | 'completed' | 'failed';
  error_message: string | null;
  credits_used: number;
  created_at: string;
  completed_at: string | null;
}

export type Database = {
  public: {
    Tables: {
      web_users: {
        Row: WebUser;
        Insert: Omit<WebUser, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<WebUser, 'id'>>;
      };
      web_payments: {
        Row: WebPayment;
        Insert: Omit<WebPayment, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<WebPayment, 'user_id'>>;
      };
      web_tryon_generations: {
        Row: WebTryonGeneration;
        Insert: Omit<WebTryonGeneration, 'id' | 'created_at' | 'completed_at'> & {
          id?: string;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Omit<WebTryonGeneration, 'id'>>;
      };
    };
  };
};
