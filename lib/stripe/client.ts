import Stripe from 'stripe';
import { stripeConfig } from './config';

// Server-side Stripe client (never expose on client!)
export const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
});

// Client-side publishable key
export const getPublishableKey = () => stripeConfig.publishableKey;
