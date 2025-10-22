# Supabase Setup Guide for FitCheck Web App

Complete database setup for FitCheck web application with authentication and credits system.

## ⚠️ IMPORTANT - V1 Testing Configuration

**This setup uses PUBLIC RLS policies for easy testing!**

✅ **Current Setup:** All authenticated users can access all data (no security restrictions)
🔒 **Production Setup:** Secure RLS policies are documented at the end (don't run them yet)

This is intentional for v1 to avoid auth issues during development. Tighten security before public launch.

---

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Database Schema](#database-schema)
- [SQL Scripts](#sql-scripts)
- [Authentication Setup](#authentication-setup)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Testing](#testing)
- [Production RLS Policies](#production-rls-policies-for-later) ⚠️ For later

---

## Overview

The FitCheck web app uses Supabase for:
- **Authentication** (Google, Apple, Email/Password)
- **User Management** (profiles, credits)
- **Payment Tracking** (Stripe integration)
- **Generation History** (try-on records)

**Important:** This database is separate from your mobile app database. Users are NOT shared between web and mobile.

---

## Prerequisites

- [ ] Supabase account created
- [ ] New Supabase project created for web app
- [ ] Project URL and API keys saved
- [ ] Service role key saved (for webhooks)

---

## Database Schema

### Tables Overview

1. **`web_users`** - User profiles and credits (extends auth.users)
2. **`web_payments`** - Payment records with Stripe metadata
3. **`web_tryon_generations`** - Try-on generation history

### Relationships

```
auth.users (Supabase Auth)
    ↓
web_users (user_id = auth.users.id)
    ↓
web_payments (user_id)
web_tryon_generations (user_id)
```

---

## SQL Scripts

### Step 1: Create Tables

Run these scripts in **Supabase SQL Editor** in order.

#### 1.1 Create `web_users` Table

```sql
-- ============================================
-- Table: web_users
-- Purpose: User profiles and credits
-- ============================================

CREATE TABLE web_users (
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

-- Add comment for documentation
COMMENT ON TABLE web_users IS 'User profiles for FitCheck web app with credits tracking';

-- Create index for faster queries
CREATE INDEX idx_web_users_email ON web_users(email);
CREATE INDEX idx_web_users_credits ON web_users(credits) WHERE credits > 0;
```

#### 1.2 Create `web_payments` Table

```sql
-- ============================================
-- Table: web_payments
-- Purpose: Payment records with Stripe integration
-- ============================================

CREATE TABLE web_payments (
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

-- Add comment
COMMENT ON TABLE web_payments IS 'Payment records with Stripe and DataFast attribution';

-- Create indexes
CREATE INDEX idx_web_payments_user_id ON web_payments(user_id);
CREATE INDEX idx_web_payments_stripe_customer ON web_payments(stripe_customer_id);
CREATE INDEX idx_web_payments_stripe_session ON web_payments(stripe_session_id);
CREATE INDEX idx_web_payments_status ON web_payments(status);
CREATE INDEX idx_web_payments_created_at ON web_payments(created_at DESC);

-- Create index for DataFast attribution
CREATE INDEX idx_web_payments_datafast_visitor ON web_payments(datafast_visitor_id) WHERE datafast_visitor_id IS NOT NULL;
```

#### 1.3 Create `web_tryon_generations` Table

```sql
-- ============================================
-- Table: web_tryon_generations
-- Purpose: Virtual try-on generation history
-- ============================================

CREATE TABLE web_tryon_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Input images
  person_image_url TEXT NOT NULL,
  garment_image_url TEXT NOT NULL,

  -- Output
  output_image_url TEXT,

  -- Configuration
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'one-pieces')),
  mode TEXT NOT NULL DEFAULT 'balanced' CHECK (mode IN ('performance', 'balanced', 'quality')),
  ai_provider TEXT NOT NULL DEFAULT 'fashn' CHECK (ai_provider IN ('fashn', 'google-nano')),

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'processing' CHECK (
    status IN ('processing', 'completed', 'failed')
  ),
  error_message TEXT,
  external_id TEXT, -- Fashn prediction ID or Google job ID

  -- Credits & billing
  credits_used INTEGER DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Performance tracking
  generation_time_seconds INTEGER
);

-- Add comment
COMMENT ON TABLE web_tryon_generations IS 'Virtual try-on generation history and status';

-- Create indexes
CREATE INDEX idx_web_tryon_user_id ON web_tryon_generations(user_id);
CREATE INDEX idx_web_tryon_status ON web_tryon_generations(status);
CREATE INDEX idx_web_tryon_created_at ON web_tryon_generations(created_at DESC);
CREATE INDEX idx_web_tryon_provider ON web_tryon_generations(ai_provider);
CREATE INDEX idx_web_tryon_external_id ON web_tryon_generations(external_id) WHERE external_id IS NOT NULL;

-- Composite index for user's recent generations
CREATE INDEX idx_web_tryon_user_recent ON web_tryon_generations(user_id, created_at DESC);
```

### Step 2: Create Functions

#### 2.1 Auto-Update Timestamp Function

```sql
-- ============================================
-- Function: update_updated_at_column
-- Purpose: Automatically update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables
CREATE TRIGGER update_web_users_updated_at
  BEFORE UPDATE ON web_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_web_payments_updated_at
  BEFORE UPDATE ON web_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 2.2 Handle New User Function

```sql
-- ============================================
-- Function: handle_new_user
-- Purpose: Create web_users record when auth user signs up
-- ============================================

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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

#### 2.3 Deduct Credits Function

```sql
-- ============================================
-- Function: deduct_user_credits
-- Purpose: Safely deduct credits from user
-- ============================================

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

COMMENT ON FUNCTION deduct_user_credits IS 'Safely deduct credits with atomic check';
```

#### 2.4 Add Credits Function

```sql
-- ============================================
-- Function: add_user_credits
-- Purpose: Add credits to user (after payment)
-- ============================================

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

COMMENT ON FUNCTION add_user_credits IS 'Add credits to user after successful payment';
```

### Step 3: Enable Row Level Security (RLS) - PUBLIC ACCESS FOR V1

**⚠️ IMPORTANT: These policies allow PUBLIC ACCESS for testing!**

These policies are intentionally permissive for v1 testing. Tighten them for production.

```sql
-- ============================================
-- Enable RLS on all tables (required by Supabase)
-- ============================================

ALTER TABLE web_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_tryon_generations ENABLE ROW LEVEL SECURITY;
```

#### RLS Policies for `web_users` - PUBLIC ACCESS

```sql
-- ⚠️ V1 TESTING: Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users"
  ON web_users FOR ALL
  USING (true)
  WITH CHECK (true);

-- Service role can do anything (for webhooks)
CREATE POLICY "Service role full access"
  ON web_users FOR ALL
  USING (auth.role() = 'service_role');
```

#### RLS Policies for `web_payments` - PUBLIC ACCESS

```sql
-- ⚠️ V1 TESTING: Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users"
  ON web_payments FOR ALL
  USING (true)
  WITH CHECK (true);

-- Service role can do anything (for webhooks)
CREATE POLICY "Service role full access"
  ON web_payments FOR ALL
  USING (auth.role() = 'service_role');
```

#### RLS Policies for `web_tryon_generations` - PUBLIC ACCESS

```sql
-- ⚠️ V1 TESTING: Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users"
  ON web_tryon_generations FOR ALL
  USING (true)
  WITH CHECK (true);

-- Service role can do anything (for webhooks)
CREATE POLICY "Service role full access"
  ON web_tryon_generations FOR ALL
  USING (auth.role() = 'service_role');
```

**Note:** These policies allow any authenticated user to access any data. This is fine for v1 testing but should be tightened for production. See the "Production RLS Policies" section at the end of this document for secure policies.

### Step 4: Create Views (Optional but Recommended)

```sql
-- ============================================
-- View: user_stats
-- Purpose: Quick user statistics
-- ============================================

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

COMMENT ON VIEW user_stats IS 'User statistics for analytics and dashboard';
```

---

## Authentication Setup

### Step 1: Enable Auth Providers in Supabase Dashboard

Go to **Authentication → Providers** in Supabase Dashboard.

#### 1.1 Google OAuth

1. Enable **Google** provider
2. Create Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - **Authorized redirect URIs**: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Copy Client ID and Client Secret to Supabase
4. Save

#### 1.2 Apple Sign-In

1. Enable **Apple** provider
2. Create Apple Services ID:
   - Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/serviceId)
   - Create Services ID
   - Enable Sign in with Apple
   - Configure domains and return URLs
3. Generate Client Secret (complicated - see [Supabase docs](https://supabase.com/docs/guides/auth/social-login/auth-apple))
4. Copy credentials to Supabase
5. Save

#### 1.3 Email/Password

1. Enable **Email** provider
2. Configure email templates (optional):
   - **Confirm signup**: Customize email template
   - **Magic link**: Customize email template
   - **Reset password**: Customize email template
3. **Disable email confirmation** (optional) if you want instant signups
4. Save

### Step 2: Configure Auth Settings

Go to **Authentication → Settings**

```
Site URL: https://www.tryfitcheck.com
Redirect URLs (add these):
- https://www.tryfitcheck.com/auth/callback
- http://localhost:3000/auth/callback (for development)

Email Auth:
- Enable email confirmations: OFF (for instant signup)
- Secure email change: ON

Session:
- JWT expiry: 3600 (1 hour)
- Refresh token expiry: 2592000 (30 days)
```

---

## Row Level Security (RLS)

RLS policies are already created in Step 3 above.

**Key Points:**
- Users can only see/edit their own data
- Service role bypasses RLS (used for webhooks)
- `auth.uid()` returns current logged-in user ID

**Test RLS:**
```sql
-- Switch to authenticated user context
SET request.jwt.claims = '{"sub": "user-uuid-here"}';

-- Test queries (should only return current user's data)
SELECT * FROM web_users WHERE id = auth.uid();
```

---

## Testing

### Test 1: Create Test User

```sql
-- Insert test user (bypassing auth)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"full_name": "Test User"}'::jsonb
);

-- Verify web_users record was created
SELECT * FROM web_users WHERE email = 'test@example.com';
```

### Test 2: Test Credit Functions

```sql
-- Get user ID
DO $$
DECLARE
  v_user_id UUID;
  v_success BOOLEAN;
BEGIN
  SELECT id INTO v_user_id FROM web_users WHERE email = 'test@example.com';

  -- Test deduct credits
  SELECT deduct_user_credits(v_user_id, 1) INTO v_success;
  RAISE NOTICE 'Deduct credits: %', v_success;

  -- Test add credits
  PERFORM add_user_credits(v_user_id, 10);
  RAISE NOTICE 'Added 10 credits';

  -- Check final balance
  RAISE NOTICE 'Final credits: %', (SELECT credits FROM web_users WHERE id = v_user_id);
END $$;
```

### Test 3: Test RLS Policies

```sql
-- As authenticated user (should see own data)
SET request.jwt.claims = '{"sub": "<user-uuid>"}';
SELECT * FROM web_users; -- Should return 1 row

-- As anon (should see nothing)
RESET request.jwt.claims;
SELECT * FROM web_users; -- Should return 0 rows
```

---

## Maintenance Queries

### Get User Credits Balance

```sql
SELECT email, credits, total_generations
FROM web_users
WHERE email = 'user@example.com';
```

### Get User Payment History

```sql
SELECT
  p.created_at,
  p.package_name,
  p.credits_purchased,
  p.amount_total / 100.0 as amount_dollars,
  p.status
FROM web_payments p
JOIN web_users u ON p.user_id = u.id
WHERE u.email = 'user@example.com'
ORDER BY p.created_at DESC;
```

### Get User Generation History

```sql
SELECT
  g.created_at,
  g.category,
  g.mode,
  g.ai_provider,
  g.status,
  g.credits_used,
  g.generation_time_seconds
FROM web_tryon_generations g
JOIN web_users u ON g.user_id = u.id
WHERE u.email = 'user@example.com'
ORDER BY g.created_at DESC
LIMIT 20;
```

### Add Credits Manually (Admin)

```sql
-- Add 100 credits to user
SELECT add_user_credits(
  (SELECT id FROM web_users WHERE email = 'user@example.com'),
  100
);
```

---

## Environment Variables

After setup, add these to your `.env.local`:

```bash
# Get from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... # IMPORTANT: Keep secret!
```

---

## Next Steps

1. ✅ Run all SQL scripts in order
2. ✅ Enable auth providers (Google, Apple, Email)
3. ✅ Configure redirect URLs
4. ✅ Test with a test user
5. ✅ Add environment variables to `.env.local`
6. → Proceed to implement auth in Next.js app
7. → Implement Stripe webhook to add credits
8. → Test complete flow end-to-end

---

## Troubleshooting

### Issue: Trigger not creating web_users record

**Solution:** Check that trigger is enabled:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue: RLS blocking queries

**Solution:** Verify service role key is set correctly in webhook code.

### Issue: Credits not deducting

**Solution:** Check for race conditions - always use `deduct_user_credits()` function.

---

## Production RLS Policies (For Later)

**⚠️ DO NOT RUN THESE NOW - Only for production deployment**

When you're ready to tighten security for production, drop the public policies and create these instead:

### Drop Public Policies

```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Allow all for authenticated users" ON web_users;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON web_payments;
DROP POLICY IF EXISTS "Allow all for authenticated users" ON web_tryon_generations;
```

### Production Policies for `web_users`

```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON web_users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (but NOT credits - only via functions)
CREATE POLICY "Users can update own profile"
  ON web_users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role has full access (for webhooks)
CREATE POLICY "Service role full access"
  ON web_users FOR ALL
  USING (auth.role() = 'service_role');
```

### Production Policies for `web_payments`

```sql
-- Users can only view their own payments
CREATE POLICY "Users can view own payments"
  ON web_payments FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create payments (for checkout)
CREATE POLICY "Users can create own payments"
  ON web_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role has full access (for webhooks)
CREATE POLICY "Service role full access"
  ON web_payments FOR ALL
  USING (auth.role() = 'service_role');
```

### Production Policies for `web_tryon_generations`

```sql
-- Users can only view their own generations
CREATE POLICY "Users can view own generations"
  ON web_tryon_generations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own generations
CREATE POLICY "Users can create own generations"
  ON web_tryon_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own generations (for polling status)
CREATE POLICY "Users can update own generations"
  ON web_tryon_generations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role full access"
  ON web_tryon_generations FOR ALL
  USING (auth.role() = 'service_role');
```

---

**Supabase Setup Complete!** ✅

**Current Setup:** Public access for all authenticated users (perfect for v1 testing)

**For Production:** Switch to the production RLS policies above when ready to launch

Next: Implement authentication in Next.js app following the Supabase Auth documentation.
