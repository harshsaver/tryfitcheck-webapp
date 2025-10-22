# FitCheck Web App - Quick Start Guide

## 🚀 You're Here - Ready to Run SQL Scripts!

### What You Need Right Now

1. ✅ Supabase project for web app (separate from mobile)
2. ✅ Supabase SQL Editor open
3. ✅ This guide open

---

## Step 1: Copy SQL to Supabase (10 minutes)

**Open:** [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

**Copy these scripts in order:**

1. **Tables (3 scripts)** → Run in SQL Editor
   - `web_users`
   - `web_payments`
   - `web_tryon_generations`

2. **Functions (4 scripts)** → Run in SQL Editor
   - `update_updated_at_column()`
   - `handle_new_user()`
   - `deduct_user_credits()`
   - `add_user_credits()`

3. **RLS Policies (3 sections)** → Run in SQL Editor
   - Enable RLS on tables
   - Public policies for `web_users`
   - Public policies for `web_payments`
   - Public policies for `web_tryon_generations`

4. **Views (1 script - optional)** → Run in SQL Editor
   - `user_stats`

**Done!** Your database is ready.

---

## Step 2: Get Supabase Credentials (2 minutes)

1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... # Keep this secret!
```

3. Add to `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# UploadThing (from Vercel)
UPLOADTHING_TOKEN=sk_test_...
UPLOADTHING_APP_ID=your_app_id

# Rest already configured
```

---

## Step 3: Configure Auth Providers (15 minutes)

**Follow:** [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) → "Authentication Setup"

### Google OAuth (5 min)
1. Create OAuth credentials in Google Cloud Console
2. Add to Supabase Dashboard → Authentication → Providers
3. Test login

### Apple Sign-In (5 min)
1. Create Services ID in Apple Developer Portal
2. Add to Supabase Dashboard
3. Test login

### Email/Password (5 min)
1. Enable in Supabase Dashboard → Authentication → Providers
2. Configure settings (disable email confirmation for testing)
3. Test signup

---

## Step 4: Test Everything Works (5 minutes)

Run test queries from [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) → "Testing" section.

---

## You're All Set! 🎉

**What's working now:**
- ✅ Database tables created
- ✅ Helper functions working
- ✅ RLS enabled (public access for testing)
- ✅ Auth providers configured
- ✅ UploadThing ready for images

**What's next:**
- Follow [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md)
- Start with frontend auth components
- Then credits system backend
- Then Google Nano Banana integration

---

## Quick Reference

| What | Where |
|------|-------|
| SQL Scripts | [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) |
| Implementation Plan | [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md) |
| UploadThing Setup | [docs/UPLOADTHING_SETUP.md](docs/UPLOADTHING_SETUP.md) |
| Stripe + DataFast | [docs/STRIPE_DATAFAST_DOC.md](docs/STRIPE_DATAFAST_DOC.md) |
| Complete Overview | [README.md](README.md) |

---

## Important Notes

### RLS Security (Current = Public)
- ⚠️ Current RLS policies allow **any authenticated user** to access **any data**
- This is **intentional** for v1 testing
- Production policies are at the end of SUPABASE_SETUP.md (don't run yet)
- Switch to production policies before public launch

### Environment Variables Checklist
```bash
# Supabase
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY

# UploadThing
✅ UPLOADTHING_TOKEN
✅ UPLOADTHING_APP_ID

# Stripe (already in Vercel)
✅ STRIPE_SECRET_KEY_TEST
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST

# AI APIs
✅ FASHN_API_KEY
⏳ GOOGLE_GEMINI_API_KEY (add when implementing Nano Banana)

# DataFast
✅ NEXT_PUBLIC_DATAFAST_WEBSITE_ID=dfid_8dDTTY4SDh54x43CILUSu
✅ NEXT_PUBLIC_DATAFAST_DOMAIN=tryfitcheck.com
```

---

**Ready to code!** 💻

Start here: [docs/IMPLEMENTATION_ROADMAP.md](docs/IMPLEMENTATION_ROADMAP.md)
