'use client';

import Link from 'next/link';
import { ArrowLeft, Check, Sparkles, Zap } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-pink transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Simple, Transparent</span>{' '}
            <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pay per try-on with no commitments. Start instantly, no signup required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Performance Mode */}
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-4">
                <Zap className="w-4 h-4" />
                Fast
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-2">Performance</h3>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-bold text-gray-900">$0.50</span>
                <span className="text-gray-600">per try-on</span>
              </div>
              <p className="text-gray-600">Quick results in ~5 seconds</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">5-second generation</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">Good quality</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">HD download</span>
              </div>
            </div>

            <Link
              href="/try-on"
              className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-center hover:border-primary-pink transition-all"
            >
              Try Now
            </Link>
          </div>

          {/* Balanced Mode - Recommended */}
          <div className="border-2 border-primary-pink rounded-3xl p-8 bg-gradient-to-br from-white to-pink-50/30 hover:shadow-2xl transition-all duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-xs font-bold">
              MOST POPULAR
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-primary-pink rounded-full text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4" />
                Recommended
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-2">Balanced</h3>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary-pink to-secondary-purple bg-clip-text text-transparent">$0.75</span>
                <span className="text-gray-600">per try-on</span>
              </div>
              <p className="text-gray-600">Great quality in ~8 seconds</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">8-second generation</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">High quality</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">HD download</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">Better details</span>
              </div>
            </div>

            <Link
              href="/try-on"
              className="block w-full py-3 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-center shadow-lg hover:shadow-xl transition-all"
            >
              Try Now
            </Link>
          </div>

          {/* Quality Mode */}
          <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:shadow-xl transition-all duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4" />
                Premium
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-2">Quality</h3>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-bold text-gray-900">$1.00</span>
                <span className="text-gray-600">per try-on</span>
              </div>
              <p className="text-gray-600">Best quality in ~12 seconds</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">12-second generation</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">Highest quality</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">HD download</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                <span className="text-gray-700">Maximum details</span>
              </div>
            </div>

            <Link
              href="/try-on"
              className="block w-full py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-center hover:border-primary-pink transition-all"
            >
              Try Now
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h3 className="text-xl font-bold font-poppins mb-6 text-center">
              All Plans Include
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">No signup required</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">Instant access</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">High-quality AI</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">Download results</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" strokeWidth={3} />
                <span className="text-gray-700">Secure payment</span>
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
            Ready in seconds • No signup needed
          </p>
        </div>
      </div>
    </div>
  );
}
