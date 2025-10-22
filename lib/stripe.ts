import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(
  process.env.STRIPE_MODE === 'live'
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
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_MODE === 'live'
      ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE!
      : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST!;
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

// Pricing configuration (in cents)
// NOTE: Stripe charges 2.9% + $0.30 per transaction
// For $0.10: You receive ~$0.07 after fees (30% fee overhead)
// For $0.25: You receive ~$0.21 after fees (16% fee overhead)
// For $0.50: You receive ~$0.47 after fees (6% fee overhead)
export const PRICING = {
  performance: { amount: 10, display: '$0.10', mode: 'performance' },
  balanced: { amount: 25, display: '$0.25', mode: 'balanced' },
  quality: { amount: 50, display: '$0.50', mode: 'quality' },
} as const;

export type PricingMode = keyof typeof PRICING;
