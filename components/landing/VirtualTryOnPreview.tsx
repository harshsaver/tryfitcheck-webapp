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
            <span className="text-gray-900">Want More Than Just</span>{' '}
            <span className="gradient-text">Virtual Try-Ons?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This website is great for quick try-ons. But the FitCheck app? That&apos;s your complete AI fashion assistant with outfit analysis, wardrobe organization, and unlimited try-ons.
          </p>
        </motion.div>

        {/* Unified App Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <div className="border-2 border-primary-pink/50 rounded-3xl p-10 md:p-12 bg-gradient-to-br from-white to-pink-50/30 relative overflow-hidden">
            <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-sm font-bold shadow-lg">
              ⚡ PREMIUM APP
            </div>

            {/* Features Section */}
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold mb-6 shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>6 Powerful Features</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
                FitCheck Premium
              </h3>
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                Your complete AI fashion assistant. Everything you need to build your perfect wardrobe and always look your best.
              </p>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-10 text-left max-w-2xl mx-auto">
                {appFeatures.map((feature, idx) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-800 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a
                  href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>Download on App Store</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_ANDROID_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>Get it on Google Play</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-gradient-to-br from-white to-pink-50/30 text-gray-500 text-sm font-semibold">
                  SEE IT IN ACTION
                </span>
              </div>
            </div>

            {/* Screenshots Gallery */}
            <div>
              <div className="text-center mb-8">
                <h4 className="text-xl md:text-2xl font-bold font-poppins mb-2 text-gray-900">
                  Real Screenshots From The App
                </h4>
                <p className="text-gray-600">
                  See what the FitCheck experience looks like
                </p>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide justify-center">
                {/* Display each screenshot twice as requested */}
                {[1, 2, 3, 1, 2, 3].map((num, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex-shrink-0 w-52"
                  >
                    <div className="relative aspect-[9/19.5] rounded-2xl overflow-hidden shadow-xl border-2 border-white/50">
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
            </div>
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
