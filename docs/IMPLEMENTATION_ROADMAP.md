# FitCheck Web App - Implementation Roadmap

## Current Status: Phase 5 - Authentication & Credits System

Last Updated: January 2025

---

## ✅ Completed Phases

### Phase 1-4: Foundation & Landing Page
- [x] Next.js 15 project setup
- [x] Premium luxury landing page design
- [x] Influencer social proof section (11 videos)
- [x] B2B explainer section
- [x] Fashn API v1.6 integration with polling
- [x] 3-step try-on UI (person → garment → configure)
- [x] Result page with download functionality

---

## 🚧 Current Phase: Authentication & Credits System

### Overview
Implementing full authentication system with Google, Apple, and Email/Password sign-in, plus credit-based payment system following Stripe + DataFast documentation.

### Goals
1. Users can sign up/login with Google, Apple, or Email/Password
2. New users get 3 free trial credits
3. Users can purchase credit packages via Stripe
4. Credits are deducted on each try-on generation
5. DataFast tracks revenue attribution

### Tasks

#### 1. Supabase Database Setup
- [ ] Run SQL scripts from `docs/SUPABASE_SETUP.md`
  - [ ] Create `web_users` table
  - [ ] Create `web_payments` table
  - [ ] Create `web_tryon_generations` table
  - [ ] Create helper functions (`deduct_user_credits`, `add_user_credits`)
  - [ ] Set up RLS policies
  - [ ] Create triggers for auto-updating timestamps
- [ ] Test database with sample queries
- [ ] Verify RLS policies work correctly

#### 2. Supabase Auth Configuration
- [ ] Enable Google OAuth provider
  - [ ] Create Google Cloud OAuth credentials
  - [ ] Configure redirect URLs
  - [ ] Test login flow
- [ ] Enable Apple Sign-In provider
  - [ ] Create Apple Services ID
  - [ ] Generate client secret
  - [ ] Configure domains
  - [ ] Test login flow
- [ ] Enable Email/Password provider
  - [ ] Configure email templates
  - [ ] Disable email confirmation (for instant signup)
  - [ ] Test signup/login flow
- [ ] Configure auth settings (JWT expiry, redirect URLs)

#### 3. Frontend Auth Implementation
- [ ] Create auth components
  - [ ] `LoginForm.tsx` - Email/password login
  - [ ] `SignupForm.tsx` - Email/password signup
  - [ ] `SocialAuthButtons.tsx` - Google/Apple buttons
  - [ ] `AuthModal.tsx` - Modal wrapper
- [ ] Create auth pages
  - [ ] `/auth/login` - Login page
  - [ ] `/auth/signup` - Signup page
  - [ ] `/auth/callback` - OAuth callback handler
- [ ] Add Supabase auth context provider
- [ ] Protect try-on routes (require auth)
- [ ] Add "Sign In" button to navigation
- [ ] Add user menu with avatar (when logged in)
- [ ] Handle auth state changes

#### 4. Credits System - Frontend
- [ ] Display user credits in navigation/header
- [ ] Create credits purchase modal
- [ ] Show pricing tiers ($5/20, $10/50, $25/150)
- [ ] Integrate with Stripe checkout
- [ ] Handle "insufficient credits" error
- [ ] Add "buy more credits" CTA
- [ ] Create user dashboard
  - [ ] Show current credits
  - [ ] Show generation history
  - [ ] Show payment history
  - [ ] Download past results

#### 5. Credits System - Backend
- [ ] Update `/api/checkout` endpoint
  - [ ] Follow `docs/STRIPE_DATAFAST_DOC.md`
  - [ ] Get DataFast cookies from request
  - [ ] Pass cookies to Stripe metadata
  - [ ] Create checkout session with credit packages
- [ ] Update `/api/webhook` endpoint
  - [ ] Handle `checkout.session.completed`
  - [ ] Extract user_id and credits from metadata
  - [ ] Call `add_user_credits()` function
  - [ ] Create payment record
  - [ ] Log DataFast attribution data
- [ ] Update `/api/generate` endpoint
  - [ ] Check user has credits before generating
  - [ ] Call `deduct_user_credits()` function
  - [ ] Create generation record
  - [ ] Handle "insufficient credits" error

#### 6. Google Nano Banana Integration
- [ ] Create `/lib/ai/google-nano.ts`
  - [ ] Implement Gemini API client
  - [ ] Convert images to base64
  - [ ] Create virtual try-on prompt template
  - [ ] Handle API responses
  - [ ] Error handling
- [ ] Update `/api/generate` endpoint
  - [ ] Add provider selection logic
  - [ ] Fallback from Fashn to Nano Banana on error
  - [ ] Track which provider was used
- [ ] Test Nano Banana with sample images
- [ ] Compare quality vs Fashn
- [ ] Optimize prompts for best results

#### 7. Image Storage
- [ ] Choose storage solution
  - Option A: Vercel Blob (recommended)
  - Option B: Cloudinary
  - Option C: Supabase Storage
- [ ] Implement upload logic in `/lib/upload.ts`
- [ ] Update `ImageUpload` component
- [ ] Store uploaded images before generation
- [ ] Clean up old images (optional)

#### 8. DataFast Integration
- [ ] Add DataFast script to `app/layout.tsx`
- [ ] Create `lib/analytics.ts` utility
- [ ] Track custom goals:
  - [ ] `sign_up_completed`
  - [ ] `payment_page_viewed`
  - [ ] `payment_initiated`
  - [ ] `payment_completed`
  - [ ] `try_on_started`
  - [ ] `try_on_completed`
- [ ] Connect DataFast to Stripe in dashboard
- [ ] Verify revenue attribution works

#### 9. Testing
- [ ] Test complete user flow:
  1. Sign up with Google
  2. Receive 3 free credits
  3. Upload images and generate try-on
  4. Credits deducted correctly
  5. Purchase more credits
  6. Webhook adds credits
  7. Generate another try-on
- [ ] Test with all auth providers (Google, Apple, Email)
- [ ] Test error cases (insufficient credits, API failures)
- [ ] Test RLS (users can't see other users' data)
- [ ] Cross-browser testing
- [ ] Mobile testing

#### 10. Deployment
- [ ] Set up environment variables in Vercel
  - [ ] Supabase keys
  - [ ] Stripe live keys
  - [ ] Fashn API key
  - [ ] Google Gemini API key
  - [ ] DataFast website ID
- [ ] Configure Stripe webhook endpoint
  - [ ] Use `www.tryfitcheck.com/api/webhook`
  - [ ] Verify no 307 redirects
  - [ ] Test webhook delivery
- [ ] Deploy to Vercel
- [ ] Test production flow end-to-end
- [ ] Monitor errors and performance

---

## 📋 Next Phase: Polish & Optimization

### To Be Planned
- [ ] Advanced features (save favorites, share results)
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Analytics dashboard
- [ ] A/B testing
- [ ] Email marketing integration

---

## 🎯 Success Criteria

**Phase 5 is complete when:**
1. ✅ Users can sign up with Google/Apple/Email
2. ✅ New users get 3 free credits automatically
3. ✅ Users can purchase credit packages
4. ✅ Credits are properly deducted on try-on
5. ✅ Both Fashn and Nano Banana work
6. ✅ DataFast tracks all revenue
7. ✅ Everything works in production

---

## 📚 Reference Documents

- **Database Setup**: `docs/SUPABASE_SETUP.md`
- **Payment System**: `docs/STRIPE_DATAFAST_DOC.md`
- **Pricing Analysis**: `docs/STRIPE_FEES_NOTE.md`
- **Current Implementation**: `docs/IMPLEMENTATION.md`

---

## ⏱ Estimated Timeline

**Total: 12-16 hours**

- Database Setup: 1-2 hours
- Auth Configuration: 2-3 hours
- Frontend Auth: 3-4 hours
- Credits Backend: 2-3 hours
- Nano Banana Integration: 2-3 hours
- Testing & Deployment: 2-3 hours

---

## 🚀 Quick Start

To continue development:

```bash
# 1. Set up Supabase database
# Open Supabase SQL Editor and run scripts from docs/SUPABASE_SETUP.md

# 2. Configure auth providers
# Go to Supabase Dashboard → Authentication → Providers

# 3. Install additional dependencies
npm install @supabase/ssr @supabase/auth-helpers-nextjs

# 4. Start implementing auth
# Begin with components/auth/LoginForm.tsx

# 5. Test locally
npm run dev
```

---

**Ready to build!** 🎨
