'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-20 pb-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-pink/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-purple/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-sm font-semibold mb-6 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 50,000+ Fashion Lovers</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-poppins mb-6 leading-tight">
              <span className="block text-gray-900">Try Before</span>
              <span className="block bg-gradient-to-r from-primary-pink via-secondary-purple to-primary-pink-dark bg-clip-text text-transparent">
                You Buy
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              See how any outfit looks on YOU with AI-powered virtual try-on. No apps, no commitments – just instant style confidence.
            </p>

            {/* Key Benefits */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start flex-wrap">
              <div className="flex items-center gap-2 text-gray-700">
                <Zap className="w-5 h-5 text-primary-pink" />
                <span className="font-medium">Instant Results</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Heart className="w-5 h-5 text-primary-pink" />
                <span className="font-medium">Hyper-Realistic AI</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Sparkles className="w-5 h-5 text-primary-pink" />
                <span className="font-medium">Privacy First</span>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center lg:justify-start">
              <Link
                href="/pricing"
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-primary-pink/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Try Virtual Try-On Now
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-purple to-primary-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <a
                href="#how-it-works"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:border-primary-pink hover:text-primary-pink transition-all duration-300 hover:scale-105 text-center"
              >
                See How It Works
              </a>
            </div>

            {/* Secondary CTA */}
            <p className="text-sm text-gray-500 mb-4">
              Starting at just $0.50 per try-on • No signup required
            </p>

            {/* App Download Alternative */}
            <div className="inline-flex flex-wrap items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Or get the full app with 3 powerful features:</span>
              <a
                href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-105 transition-transform"
              >
                <Image
                  src="/images/app-store-badges/appstore.png"
                  alt="Download on App Store"
                  width={100}
                  height={30}
                  className="h-8 w-auto"
                />
              </a>
              <a
                href={process.env.NEXT_PUBLIC_ANDROID_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-105 transition-transform"
              >
                <Image
                  src="/images/app-store-badges/play.png"
                  alt="Get it on Google Play"
                  width={100}
                  height={30}
                  className="h-8 w-auto"
                />
              </a>
            </div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* Before/After Comparison Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Before Image Placeholder */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-sm font-medium text-gray-500">Your Photo</p>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 shadow-lg">
                    Before
                  </div>
                </div>

                {/* After Image Placeholder */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-pink/20 to-secondary-purple/20 border-2 border-primary-pink">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">✨</div>
                      <p className="text-sm font-medium text-primary-pink">AI Magic</p>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 px-3 py-1 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-xs font-semibold shadow-lg">
                    After
                  </div>
                  <div className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4 text-primary-pink" />
                  </div>
                </div>
              </div>

              {/* Action Text */}
              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Upload your photo + Pick an outfit
                </p>
                <p className="text-xs text-gray-500">
                  Get your AI-powered try-on in seconds ⚡
                </p>
              </div>

              {/* Floating Trust Indicators */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-4 py-2 bg-white rounded-full shadow-xl border-2 border-green-500"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold text-gray-700">AI Ready</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-bold">5sec Results</span>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-10 right-10 w-40 h-40 bg-primary-pink/30 rounded-full blur-3xl" />
            <div className="absolute -z-10 bottom-10 left-10 w-40 h-40 bg-secondary-purple/30 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
