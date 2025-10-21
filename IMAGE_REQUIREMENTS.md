# FitCheck Web App - Image Requirements

This document lists all placeholder images that need to be replaced with actual content.

## App Screenshots

**Location:** `public/images/screenshots/`

**Current Status:** ✅ 3 screenshots exist, need 3 more

- [x] `screenshot1.png` - Existing (1531 KB)
- [x] `screenshot2.png` - Existing (1497 KB)
- [x] `screenshot3.png` - Existing (1322 KB)
- [ ] `screenshot4.png` - **NEEDED** - Additional app feature screenshot
- [ ] `screenshot5.png` - **NEEDED** - Additional app feature screenshot
- [ ] `screenshot6.png` - **NEEDED** - Additional app feature screenshot

**Specifications:**
- Aspect ratio: 9:19.5 (iPhone screenshot ratio)
- Format: PNG
- Recommended size: ~1500 KB or less
- Usage: VirtualTryOnPreview section (Mobile App tab)

---

## Feature Section Images

**Location:** `components/landing/Features.tsx`

**Current Status:** ❌ Using emoji placeholders

### Feature 1: See Yourself in Any Outfit
- **Placeholder:** 📸→👗→✨
- **Needed:** `feature-1-virtual-tryon.png` or `feature-1-virtual-tryon.jpg`
- **Description:** Image showing upload photo → select outfit → AI result flow
- **Aspect ratio:** Square (1:1)
- **Recommended size:** 800x800px

### Feature 2: Instant AI Results
- **Placeholder:** ⚡
- **Needed:** `feature-2-instant-results.png` or `feature-2-instant-results.jpg`
- **Description:** Image showing speed/instant processing
- **Aspect ratio:** Square (1:1)
- **Recommended size:** 800x800px

### Feature 3: Make Confident Decisions
- **Placeholder:** 💰→😊
- **Needed:** `feature-3-confident-decisions.png` or `feature-3-confident-decisions.jpg`
- **Description:** Image showing happy customer/reduced returns
- **Aspect ratio:** Square (1:1)
- **Recommended size:** 800x800px

### Feature 4: Privacy & Security First
- **Placeholder:** 🔒
- **Needed:** `feature-4-privacy.png` or `feature-4-privacy.jpg`
- **Description:** Image showing security/privacy concept
- **Aspect ratio:** Square (1:1)
- **Recommended size:** 800x800px

---

## Business Solution Section Images

**Location:** `components/landing/BusinessSolution.tsx`

**Current Status:** ❌ Using emoji placeholders

### Solution 1: Create Realistic On-Model Photos
- **Placeholder:** 👕→👤→✨
- **Needed:** `business-1-on-model.png` or `business-1-on-model.jpg`
- **Description:** Product photo transformed into on-model image
- **Aspect ratio:** 16:9 (video/landscape)
- **Recommended size:** 1200x675px

### Solution 2: Change Clothing on Existing Models
- **Placeholder:** 📸→👗→💫
- **Needed:** `business-2-change-outfit.png` or `business-2-change-outfit.jpg`
- **Description:** Same model wearing different outfits
- **Aspect ratio:** 16:9 (video/landscape)
- **Recommended size:** 1200x675px

### Solution 3: Diversify Your Model Portfolio
- **Placeholder:** 👤→👥→🌈
- **Needed:** `business-3-diverse-models.png` or `business-3-diverse-models.jpg`
- **Description:** Same outfit on different diverse models
- **Aspect ratio:** 16:9 (video/landscape)
- **Recommended size:** 1200x675px

### Solution 4: No Training Required
- **Placeholder:** ⚡
- **Needed:** `business-4-no-training.png` or `business-4-no-training.jpg`
- **Description:** Simple single image input concept
- **Aspect ratio:** 16:9 (video/landscape)
- **Recommended size:** 1200x675px

---

## How It Works Section

**Location:** `components/landing/HowItWorks.tsx`

**Current Status:** ✅ Using interactive animated demos (no images needed currently)

The How It Works section uses animated icons and interactive UI elements:
- Step 1: Animated upload icon
- Step 2: Interactive outfit grid
- Step 3: Rotating AI processing animation
- Step 4: Bouncing download icon

**Optional Enhancement:** Could add actual screenshot/video examples in the future.

---

## Screenshots Section (Before/After Examples)

**Location:** `components/landing/Screenshots.tsx`

**Current Status:** ❌ Using emoji placeholders

### Before Photo
- **Placeholder:** 📸 (in gray gradient box)
- **Needed:** `example-before.png` or `example-before.jpg`
- **Description:** Full-body photo of person in simple outfit
- **Aspect ratio:** 3:4 (portrait)
- **Recommended size:** 600x800px

### After Photo (With Outfit)
- **Placeholder:** ✨ (in pink gradient box)
- **Needed:** `example-after.png` or `example-after.jpg`
- **Description:** Same person wearing a fashionable outfit (AI try-on result)
- **Aspect ratio:** 3:4 (portrait)
- **Recommended size:** 600x800px

---

## Hero Section

**Location:** `components/landing/Hero.tsx`

**Current Status:** ❌ Using emoji placeholders

### Hero Before Image
- **Placeholder:** 📸 (Your Photo)
- **Needed:** `hero-before.png` or `hero-before.jpg`
- **Description:** Sample user photo for hero demonstration
- **Aspect ratio:** 3:4 (portrait)
- **Recommended size:** 400x533px

### Hero After Image
- **Placeholder:** ✨ (AI Magic)
- **Needed:** `hero-after.png` or `hero-after.jpg`
- **Description:** Sample try-on result for hero demonstration
- **Aspect ratio:** 3:4 (portrait)
- **Recommended size:** 400x533px

---

## Social Proof Section

**Location:** `components/landing/SocialProof.tsx`

**Current Status:** ✅ 11 influencer videos exist

Videos are located at `public/videos/1.mp4` through `public/videos/11.mp4`

**No additional images needed for this section.**

---

## Testimonials Section

**Location:** `components/landing/Testimonials.tsx`

**Current Status:** ✅ Using initial avatars (SJ, EC, JM)

**Optional Enhancement:** Could add actual profile photos in the future.
- `testimonial-sarah.jpg`
- `testimonial-emily.jpg`
- `testimonial-jessica.jpg`

---

## Summary of Immediate Needs

### High Priority (Core Features)
1. **3 Additional App Screenshots** (screenshot4.png, screenshot5.png, screenshot6.png)
2. **Hero Section Examples** (hero-before.png, hero-after.png)
3. **Screenshots Section Examples** (example-before.png, example-after.png)

### Medium Priority (Feature Showcase)
4. **4 Feature Images** (feature-1 through feature-4)
5. **4 Business Solution Images** (business-1 through business-4)

### Low Priority (Nice to Have)
6. **3 Testimonial Photos** (Optional - currently using initials)

---

## File Organization

Recommended folder structure:

```
public/
  images/
    screenshots/        # App screenshots
      screenshot1.png   ✅ Exists
      screenshot2.png   ✅ Exists
      screenshot3.png   ✅ Exists
      screenshot4.png   ❌ Needed
      screenshot5.png   ❌ Needed
      screenshot6.png   ❌ Needed

    features/          # Create this folder
      feature-1-virtual-tryon.png
      feature-2-instant-results.png
      feature-3-confident-decisions.png
      feature-4-privacy.png

    business/          # Create this folder
      business-1-on-model.png
      business-2-change-outfit.png
      business-3-diverse-models.png
      business-4-no-training.png

    examples/          # Create this folder
      hero-before.png
      hero-after.png
      example-before.png
      example-after.png

    testimonials/      # Optional - Create if adding photos
      testimonial-sarah.jpg
      testimonial-emily.jpg
      testimonial-jessica.jpg

  videos/              # Influencer content
    1.mp4 through 11.mp4   ✅ All exist
```

---

## Notes

- All images should be optimized for web (compressed without losing quality)
- Use WebP format where possible for better compression
- Ensure images are high-resolution enough for retina displays (2x)
- Maintain consistent visual style across all images
- All placeholder emojis can be replaced once real images are ready
