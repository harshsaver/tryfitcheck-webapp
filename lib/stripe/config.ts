/**
 * Stripe Configuration
 * Automatically selects test or live mode based on environment
 */

// Determine if we're in test mode
export const isTestMode =
  process.env.NODE_ENV !== 'production' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
  process.env.STRIPE_MODE === 'test';

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
      `Mode: ${isTestMode ? 'TEST' : 'LIVE'}\n` +
      `Please check your .env file or Vercel environment variables.`
    );
  }
  return value;
}

export const stripeConfig = {
  // API Keys
  publishableKey: isTestMode
    ? getRequiredEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST')
    : getRequiredEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE'),

  secretKey: isTestMode
    ? getRequiredEnvVar('STRIPE_SECRET_KEY_TEST')
    : getRequiredEnvVar('STRIPE_SECRET_KEY_LIVE'),

  // Price IDs for credit packages
  basicPriceId: isTestMode
    ? getRequiredEnvVar('STRIPE_BASIC_PRICE_TEST')
    : getRequiredEnvVar('STRIPE_BASIC_PRICE_LIVE'),

  starterPriceId: isTestMode
    ? getRequiredEnvVar('STRIPE_STARTER_PRICE_TEST')
    : getRequiredEnvVar('STRIPE_STARTER_PRICE_LIVE'),

  proPriceId: isTestMode
    ? getRequiredEnvVar('STRIPE_PRO_PRICE_TEST')
    : getRequiredEnvVar('STRIPE_PRO_PRICE_LIVE'),
};

// Credit package configurations
export const CREDIT_PACKAGES = {
  BASIC: {
    name: 'Basic',
    credits: 1,
    price: 0.50,
    priceId: stripeConfig.basicPriceId,
  },
  STARTER: {
    name: 'Starter',
    credits: 5,
    price: 2.00,
    priceId: stripeConfig.starterPriceId,
    savings: '20%', // vs 5 × $0.50
  },
  PRO: {
    name: 'Pro',
    credits: 15,
    price: 5.00,
    priceId: stripeConfig.proPriceId,
    savings: '33%', // vs 15 × $0.50
    popular: true,
  },
} as const;

// Helper to get package by price ID
export function getPackageByPriceId(priceId: string) {
  for (const [key, pkg] of Object.entries(CREDIT_PACKAGES)) {
    if (pkg.priceId === priceId) {
      return { ...pkg, key };
    }
  }
  return null;
}
