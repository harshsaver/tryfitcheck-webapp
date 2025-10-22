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
  starterPriceId: isTestMode
    ? getRequiredEnvVar('STRIPE_STARTER_PRICE_TEST')
    : getRequiredEnvVar('STRIPE_STARTER_PRICE_LIVE'),

  popularPriceId: isTestMode
    ? getRequiredEnvVar('STRIPE_POPULAR_PRICE_TEST')
    : getRequiredEnvVar('STRIPE_POPULAR_PRICE_LIVE'),

  proPriceId: isTestMode
    ? getRequiredEnvVar('STRIPE_PRO_PRICE_TEST')
    : getRequiredEnvVar('STRIPE_PRO_PRICE_LIVE'),
};

// Credit package configurations
export const CREDIT_PACKAGES = {
  STARTER: {
    name: 'Starter',
    credits: 20,
    price: 5.00,
    priceId: stripeConfig.starterPriceId,
    pricePerCredit: 0.25,
  },
  POPULAR: {
    name: 'Popular',
    credits: 50,
    price: 10.00,
    priceId: stripeConfig.popularPriceId,
    pricePerCredit: 0.20,
    savings: '20%',
    popular: true,
  },
  PRO: {
    name: 'Pro',
    credits: 150,
    price: 25.00,
    priceId: stripeConfig.proPriceId,
    pricePerCredit: 0.17,
    savings: '32%',
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
