import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Determine if we're in test or live mode
// Auto-switches based on environment
const isLiveMode =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

// Get Stripe keys with fallback
const getStripeSecretKey = () => {
  const key = isLiveMode
    ? process.env.STRIPE_SECRET_KEY_LIVE
    : process.env.STRIPE_SECRET_KEY_TEST;

  if (!key) {
    console.warn('Stripe secret key not configured. Payment features will be unavailable.');
    return 'sk_test_placeholder'; // Placeholder to prevent crashes
  }
  return key;
};

const getStripePublishableKey = () => {
  const key = isLiveMode
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST;

  if (!key) {
    console.warn('Stripe publishable key not configured. Payment features will be unavailable.');
    return null;
  }
  return key;
};

// Server-side Stripe instance
export const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2025-09-30.clover',
});

// Client-side Stripe instance
let stripePromise: Promise<any> | null = null;
export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = getStripePublishableKey();
    if (!publishableKey) {
      return null;
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Helper to get price ID with fallback
const getPriceId = (liveKey: string | undefined, testKey: string | undefined) => {
  const key = isLiveMode ? liveKey : testKey;
  return key || 'price_placeholder';
};

// Credit package pricing
export const CREDIT_PACKAGES = {
  starter: {
    id: 'starter',
    name: 'Starter',
    credits: 20,
    price: 500, // $5.00 in cents
    priceDisplay: '$5',
    priceId: getPriceId(
      process.env.STRIPE_STARTER_PRICE_LIVE,
      process.env.STRIPE_STARTER_PRICE_TEST
    ),
    pricePerCredit: 0.25,
    popular: false,
  },
  popular: {
    id: 'popular',
    name: 'Popular',
    credits: 50,
    price: 1000, // $10.00 in cents
    priceDisplay: '$10',
    priceId: getPriceId(
      process.env.STRIPE_POPULAR_PRICE_LIVE,
      process.env.STRIPE_POPULAR_PRICE_TEST
    ),
    pricePerCredit: 0.20,
    popular: true,
    badge: 'Best Value',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    credits: 150,
    price: 2500, // $25.00 in cents
    priceDisplay: '$25',
    priceId: getPriceId(
      process.env.STRIPE_PRO_PRICE_LIVE,
      process.env.STRIPE_PRO_PRICE_TEST
    ),
    pricePerCredit: 0.17,
    popular: false,
  },
} as const;

export type CreditPackageId = keyof typeof CREDIT_PACKAGES;

// Helper to get package by ID
export function getCreditPackage(packageId: CreditPackageId) {
  return CREDIT_PACKAGES[packageId];
}

// Helper to get package by price ID
export function getCreditPackageByPriceId(priceId: string) {
  return Object.values(CREDIT_PACKAGES).find(pkg => pkg.priceId === priceId);
}

// Export mode for debugging
export const stripeMode = isLiveMode ? 'live' : 'test';
