-- FitCheck Web Application - Complete Database Setup
-- Run this entire script in your Supabase SQL Editor
-- This will create all tables, policies, indexes, and functions needed

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Web Users Table
-- Stores user credits and generation statistics
CREATE TABLE IF NOT EXISTS web_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 3, -- Start with 3 free trial credits
  total_generations INTEGER DEFAULT 0,
  total_credits_purchased INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Web Payments Table
-- Stores one-time payment records (credit purchases, not subscriptions)
CREATE TABLE IF NOT EXISTS web_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_total INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'completed', 'failed', 'refunded')
  ),
  credits_purchased INTEGER NOT NULL,
  package_name TEXT, -- 'starter', 'popular', 'pro'

  -- DataFast revenue attribution
  datafast_visitor_id TEXT,
  datafast_session_id TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Web Virtual Try-On Generations Table
-- Stores all try-on generation records
CREATE TABLE IF NOT EXISTS web_tryon_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_image_url TEXT NOT NULL,
  garment_image_url TEXT NOT NULL,
  output_image_url TEXT,
  category TEXT CHECK (category IN ('tops', 'bottoms', 'one-pieces', 'auto')),
  mode TEXT DEFAULT 'balanced' CHECK (mode IN ('performance', 'balanced', 'quality')),
  ai_provider TEXT DEFAULT 'fashn' CHECK (ai_provider IN ('fashn', 'google-nano')),
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  error_message TEXT,
  external_id TEXT, -- Fashn prediction ID or Google job ID
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  generation_time_seconds INTEGER
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Web Users Indexes
CREATE INDEX IF NOT EXISTS idx_web_users_email ON web_users(email);
CREATE INDEX IF NOT EXISTS idx_web_users_credits ON web_users(credits);

-- Web Payments Indexes
CREATE INDEX IF NOT EXISTS idx_web_payments_user_id ON web_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_web_payments_stripe_customer ON web_payments(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_web_payments_stripe_session ON web_payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_web_payments_status ON web_payments(status);
CREATE INDEX IF NOT EXISTS idx_web_payments_created_at ON web_payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_payments_datafast_visitor ON web_payments(datafast_visitor_id) WHERE datafast_visitor_id IS NOT NULL;

-- Web Try-On Generations Indexes
CREATE INDEX IF NOT EXISTS idx_web_tryon_user_id ON web_tryon_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_web_tryon_status ON web_tryon_generations(status);
CREATE INDEX IF NOT EXISTS idx_web_tryon_created_at ON web_tryon_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_tryon_ai_provider ON web_tryon_generations(ai_provider);
CREATE INDEX IF NOT EXISTS idx_web_tryon_external_id ON web_tryon_generations(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_web_tryon_user_recent ON web_tryon_generations(user_id, created_at DESC);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE web_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_tryon_generations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================

-- Web Users Policies
-- Users can view their own record
CREATE POLICY "Users can view own record"
  ON web_users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own record (for credits tracking)
CREATE POLICY "Users can update own record"
  ON web_users FOR UPDATE
  USING (auth.uid() = id);

-- Service role can manage all users (for webhooks and admin operations)
CREATE POLICY "Service role can manage all users"
  ON web_users FOR ALL
  USING (auth.role() = 'service_role');

-- Web Payments Policies
-- Users can view their own payment
CREATE POLICY "Users can view own payment"
  ON web_payments FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all payments (for webhooks)
CREATE POLICY "Service role can manage payments"
  ON web_payments FOR ALL
  USING (auth.role() = 'service_role');

-- Web Try-On Generations Policies
-- Users can view their own generations
CREATE POLICY "Users can view own generations"
  ON web_tryon_generations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own generations
CREATE POLICY "Users can insert own generations"
  ON web_tryon_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can manage all generations (for API operations)
CREATE POLICY "Service role can manage all generations"
  ON web_tryon_generations FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- 5. CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. CREATE TRIGGERS
-- ============================================================================

-- Trigger for web_users updated_at
DROP TRIGGER IF EXISTS update_web_users_updated_at ON web_users;
CREATE TRIGGER update_web_users_updated_at
  BEFORE UPDATE ON web_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for web_payments updated_at
DROP TRIGGER IF EXISTS update_web_payments_updated_at ON web_payments;
CREATE TRIGGER update_web_payments_updated_at
  BEFORE UPDATE ON web_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. GRANT PERMISSIONS (if needed)
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON web_users TO authenticated;
GRANT SELECT ON web_payments TO authenticated;
GRANT SELECT, INSERT ON web_tryon_generations TO authenticated;

-- Grant full access to service_role
GRANT ALL ON web_users TO service_role;
GRANT ALL ON web_payments TO service_role;
GRANT ALL ON web_tryon_generations TO service_role;

-- ============================================================================
-- 8. UTILITY FUNCTIONS (Optional but useful)
-- ============================================================================

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.web_users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to deduct credits atomically
CREATE OR REPLACE FUNCTION deduct_user_credits(
  p_user_id UUID,
  p_credits INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  -- Lock the row to prevent race conditions
  SELECT credits INTO v_current_credits
  FROM web_users
  WHERE id = p_user_id
  FOR UPDATE;

  -- Check if user has enough credits
  IF v_current_credits < p_credits THEN
    RETURN FALSE;
  END IF;

  -- Deduct credits
  UPDATE web_users
  SET credits = credits - p_credits,
      total_generations = total_generations + 1,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits after payment
CREATE OR REPLACE FUNCTION add_user_credits(
  p_user_id UUID,
  p_credits INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE web_users
  SET credits = credits + p_credits,
      total_credits_purchased = total_credits_purchased + p_credits,
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user credits
CREATE OR REPLACE FUNCTION get_user_credits(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  user_credits INTEGER;
BEGIN
  SELECT credits INTO user_credits
  FROM web_users
  WHERE id = user_uuid;

  RETURN COALESCE(user_credits, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has sufficient credits
CREATE OR REPLACE FUNCTION has_sufficient_credits(user_uuid UUID, required_credits INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
  user_credits INTEGER;
BEGIN
  SELECT credits INTO user_credits
  FROM web_users
  WHERE id = user_uuid;

  RETURN COALESCE(user_credits, 0) >= required_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. VIEWS (Optional - for analytics)
-- ============================================================================

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.credits,
  u.total_generations,
  u.total_credits_purchased,
  COUNT(DISTINCT p.id) as total_payments,
  COALESCE(SUM(p.amount_total), 0) as lifetime_revenue_cents,
  COUNT(DISTINCT g.id) as total_generations_count,
  COUNT(DISTINCT g.id) FILTER (WHERE g.status = 'completed') as completed_generations,
  COUNT(DISTINCT g.id) FILTER (WHERE g.status = 'failed') as failed_generations,
  u.created_at as user_since
FROM web_users u
LEFT JOIN web_payments p ON p.user_id = u.id AND p.status = 'completed'
LEFT JOIN web_tryon_generations g ON g.user_id = u.id
GROUP BY u.id;

-- View for recent generations
CREATE OR REPLACE VIEW recent_generations AS
SELECT
  g.id,
  g.user_id,
  u.email,
  g.category,
  g.mode,
  g.ai_provider,
  g.status,
  g.credits_used,
  g.created_at,
  g.completed_at,
  g.generation_time_seconds,
  EXTRACT(EPOCH FROM (g.completed_at - g.created_at)) as calculated_time_seconds
FROM web_tryon_generations g
LEFT JOIN web_users u ON g.user_id = u.id
ORDER BY g.created_at DESC;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

-- Verify tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('web_users', 'web_payments', 'web_tryon_generations')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('web_users', 'web_payments', 'web_tryon_generations');

-- Show created indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('web_users', 'web_payments', 'web_tryon_generations')
ORDER BY tablename, indexname;
