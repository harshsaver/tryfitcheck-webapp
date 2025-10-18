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
  credits INTEGER DEFAULT 0,
  total_generations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Web Payments Table
-- Stores payment and subscription information
CREATE TABLE IF NOT EXISTS web_payments (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (
    status IN ('active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired')
  ),
  plan_type TEXT,
  credits_purchased INTEGER,
  current_period_end TIMESTAMPTZ,
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
  category TEXT,
  mode TEXT DEFAULT 'balanced',
  ai_provider TEXT DEFAULT 'fashn' CHECK (ai_provider IN ('fashn', 'google-nano')),
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  error_message TEXT,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Web Users Indexes
CREATE INDEX IF NOT EXISTS idx_web_users_email ON web_users(email);
CREATE INDEX IF NOT EXISTS idx_web_users_credits ON web_users(credits);

-- Web Payments Indexes
CREATE INDEX IF NOT EXISTS idx_web_payments_stripe_customer ON web_payments(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_web_payments_subscription ON web_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_web_payments_status ON web_payments(status);

-- Web Try-On Generations Indexes
CREATE INDEX IF NOT EXISTS idx_web_tryon_user_id ON web_tryon_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_web_tryon_status ON web_tryon_generations(status);
CREATE INDEX IF NOT EXISTS idx_web_tryon_created_at ON web_tryon_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_tryon_ai_provider ON web_tryon_generations(ai_provider);

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
CREATE OR REPLACE VIEW user_statistics AS
SELECT
  u.id,
  u.email,
  u.credits,
  u.total_generations,
  p.plan_type,
  p.status as payment_status,
  COUNT(g.id) as completed_generations,
  u.created_at as user_since
FROM web_users u
LEFT JOIN web_payments p ON u.id = p.user_id
LEFT JOIN web_tryon_generations g ON u.id = g.user_id AND g.status = 'completed'
GROUP BY u.id, u.email, u.credits, u.total_generations, p.plan_type, p.status, u.created_at;

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
  EXTRACT(EPOCH FROM (g.completed_at - g.created_at)) as processing_time_seconds
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
