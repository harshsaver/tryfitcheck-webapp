'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Sparkles, Zap, Coins, Loader2 } from 'lucide-react';
import { CREDIT_PACKAGES } from '@/lib/stripe';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuyCredits = async (packageId: string) => {
    setLoading(packageId);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert('Please sign in to purchase credits');
          return;
        }
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-pink transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <Link
              href="/try-on"
              className="px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
            >
              Try Virtual Try-On
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Buy Credits,</span>{' '}
            <span className="gradient-text">Try More Outfits</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Purchase credit packages and use them anytime. Each virtual try-on costs just 1 credit!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Starter Package */}
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">
                <Zap className="w-4 h-4" />
                Get Started
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-2">{CREDIT_PACKAGES.starter.name}</h3>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">{CREDIT_PACKAGES.starter.priceDisplay}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-primary-pink" />
                <span className="text-2xl font-bold text-primary-pink">{CREDIT_PACKAGES.starter.credits} Credits</span>
              </div>
              <p className="text-sm text-gray-600">${CREDIT_PACKAGES.starter.pricePerCredit.toFixed(2)} per credit</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">{CREDIT_PACKAGES.starter.credits} virtual try-ons</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">Never expires</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">HD downloads</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">All AI providers</span>
              </div>
            </div>

            <button
              onClick={() => handleBuyCredits('starter')}
              disabled={loading === 'starter'}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === 'starter' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy Credits'
              )}
            </button>
          </div>

          {/* Popular Package - Recommended */}
          <div className="border-2 border-primary-pink rounded-3xl p-8 bg-gradient-to-br from-white to-pink-50/30 hover:shadow-2xl transition-all duration-300 relative transform hover:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-xs font-bold">
              {CREDIT_PACKAGES.popular.badge?.toUpperCase()}
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-primary-pink rounded-full text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4" />
                Most Popular
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-2">{CREDIT_PACKAGES.popular.name}</h3>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary-pink to-secondary-purple bg-clip-text text-transparent">{CREDIT_PACKAGES.popular.priceDisplay}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-primary-pink" />
                <span className="text-2xl font-bold text-primary-pink">{CREDIT_PACKAGES.popular.credits} Credits</span>
              </div>
              <p className="text-sm text-gray-600">${CREDIT_PACKAGES.popular.pricePerCredit.toFixed(2)} per credit</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">{CREDIT_PACKAGES.popular.credits} virtual try-ons</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">Never expires</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">HD downloads</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">All AI providers</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700 font-semibold">20% savings</span>
              </div>
            </div>

            <button
              onClick={() => handleBuyCredits('popular')}
              disabled={loading === 'popular'}
              className="w-full py-3 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === 'popular' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy Credits'
              )}
            </button>
          </div>

          {/* Pro Package */}
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4" />
                Best Deal
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-2">{CREDIT_PACKAGES.pro.name}</h3>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-gray-900">{CREDIT_PACKAGES.pro.priceDisplay}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="w-5 h-5 text-primary-pink" />
                <span className="text-2xl font-bold text-primary-pink">{CREDIT_PACKAGES.pro.credits} Credits</span>
              </div>
              <p className="text-sm text-gray-600">${CREDIT_PACKAGES.pro.pricePerCredit.toFixed(2)} per credit</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">{CREDIT_PACKAGES.pro.credits} virtual try-ons</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">Never expires</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">HD downloads</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">All AI providers</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700 font-semibold">32% savings</span>
              </div>
            </div>

            <button
              onClick={() => handleBuyCredits('pro')}
              disabled={loading === 'pro'}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === 'pro' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Buy Credits'
              )}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h3 className="text-xl font-bold font-poppins mb-6 text-center">
              All Credit Packages Include
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">Credits never expire</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">Instant access</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">Multiple AI providers</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">HD image downloads</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">Secure payment via Stripe</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">Privacy protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/try-on"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Start Virtual Try-On
          </Link>
          <p className="text-gray-500 mt-4">
            Buy credits once • Use them anytime • Never expire
          </p>
        </div>

        {/* FAQ / Info Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-primary-pink/30">
            <h3 className="text-xl font-bold font-poppins mb-4 text-center">How Credits Work</h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start gap-3">
                <span className="text-primary-pink font-bold">1.</span>
                <span>Purchase any credit package above - credits are added to your account instantly</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-primary-pink font-bold">2.</span>
                <span>Each virtual try-on costs 1 credit, regardless of which AI provider you choose</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-primary-pink font-bold">3.</span>
                <span>Credits never expire - use them whenever you want to try on new outfits</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-primary-pink font-bold">4.</span>
                <span>Buy more credits anytime - the more you buy, the more you save per credit</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
