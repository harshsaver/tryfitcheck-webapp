import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Determine if we're in test or live mode
// Auto-switches based on environment
const isLiveMode =
  process.env.NODE_ENV === 'production' &&
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

// Server-side Stripe instance
export const stripe = new Stripe(
  isLiveMode
    ? process.env.STRIPE_SECRET_KEY_LIVE!
    : process.env.STRIPE_SECRET_KEY_TEST!,
  {
    apiVersion: '2025-09-30.clover',
  }
);

// Client-side Stripe instance
let stripePromise: Promise<any> | null = null;
export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = isLiveMode
      ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE!
      : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST!;
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Credit package pricing
export const CREDIT_PACKAGES = {
  starter: {
    id: 'starter',
    name: 'Starter',
    credits: 20,
    price: 500, // $5.00 in cents
    priceDisplay: '$5',
    priceId: isLiveMode
      ? process.env.STRIPE_STARTER_PRICE_LIVE!
      : process.env.STRIPE_STARTER_PRICE_TEST!,
    pricePerCredit: 0.25,
    popular: false,
  },
  popular: {
    id: 'popular',
    name: 'Popular',
    credits: 50,
    price: 1000, // $10.00 in cents
    priceDisplay: '$10',
    priceId: isLiveMode
      ? process.env.STRIPE_POPULAR_PRICE_LIVE!
      : process.env.STRIPE_POPULAR_PRICE_TEST!,
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
    priceId: isLiveMode
      ? process.env.STRIPE_PRO_PRICE_LIVE!
      : process.env.STRIPE_PRO_PRICE_TEST!,
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
