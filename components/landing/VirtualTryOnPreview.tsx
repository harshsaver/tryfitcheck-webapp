'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function VirtualTryOnPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const appFeatures = [
    'AI outfit analysis & ratings',
    'Smart wardrobe organizer',
    'Unlimited virtual try-ons',
    'Personalized style recommendations',
    'Mix & match from your closet',
    'Save favorite looks',
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Get The Full Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">The App is Where</span>{' '}
            <span className="gradient-text">The Magic Happens</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The website is perfect for quick virtual try-ons. But the FitCheck app? That's the real deal with AI-powered outfit analysis, smart wardrobe organization, and so much more.
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
          {/* Web Version Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="border-2 border-gray-200 rounded-2xl p-8 bg-white h-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold mb-6">
                💳 Simple & Quick
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-3 text-gray-900">
                Web Virtual Try-On
              </h3>
              <p className="text-gray-600 mb-6">
                Perfect for one-time use when shopping online. Pay per try-on, no commitment.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  <span>Pay per try-on (from $0.50)</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  <span>Virtual try-on only</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Check className="w-5 h-5 text-gray-400" strokeWidth={2} />
                  <span>No signup required</span>
                </div>
              </div>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-primary-pink font-semibold hover:gap-3 transition-all"
              >
                <span>Try on web</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* App Version Card - Highlighted */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="border-2 border-primary-pink/50 rounded-2xl p-8 bg-gradient-to-br from-white to-pink-50/30 h-full relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-xs font-bold">
                RECOMMENDED
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold mb-6 shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>Premium Features</span>
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-3 text-gray-900">
                FitCheck Premium App
              </h3>
              <p className="text-gray-600 mb-6">
                Your complete AI fashion assistant with unlimited try-ons, outfit analysis, and personalized style advice.
              </p>
              <div className="space-y-3 mb-8">
                {appFeatures.map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + idx * 0.05 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-3">
                <a
                  href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>Download on App Store</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_ANDROID_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>Get it on Google Play</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* App Screenshots Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold font-poppins mb-3 text-gray-900">
              See The App In Action
            </h3>
            <p className="text-gray-600">
              Real screenshots from the FitCheck mobile app
            </p>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide justify-center">
            {/* Display each screenshot twice as requested */}
            {[1, 2, 3, 1, 2, 3].map((num, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex-shrink-0 w-56"
              >
                <div className="relative aspect-[9/19.5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image
                    src={`/images/screenshots/screenshot${num}.png`}
                    alt={`App Screenshot ${num}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
