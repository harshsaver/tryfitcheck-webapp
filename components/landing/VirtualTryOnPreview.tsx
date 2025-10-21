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
  const [activeTab, setActiveTab] = useState<'web' | 'app'>('web');

  const features = {
    web: [
      'Pay per try-on (from $0.50)',
      'No signup required',
      'Instant access',
      'Virtual try-on only',
      'High-quality AI results',
      'Download & share results',
    ],
    app: [
      'AI outfit analysis & ratings',
      'Smart wardrobe organizer',
      'Unlimited virtual try-ons',
      'Personalized style recommendations',
      'Mix & match from your closet',
      'Premium subscription',
    ],
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Choose Your Path</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Web or App?</span>{' '}
            <span className="gradient-text">You Decide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Quick try-on on the web or full AI assistant in our premium app
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Tab Selector - Premium Minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex p-1.5 bg-white border-2 border-gray-200 rounded-full shadow-lg">
              <button
                onClick={() => setActiveTab('web')}
                className={`px-10 py-4 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'web'
                    ? 'bg-gradient-to-r from-primary-pink to-secondary-purple text-white shadow-xl'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Web Version
              </button>
              <button
                onClick={() => setActiveTab('app')}
                className={`px-10 py-4 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'app'
                    ? 'bg-gradient-to-r from-primary-pink to-secondary-purple text-white shadow-xl'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mobile App
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-2 border-gray-200 rounded-3xl p-12 bg-white shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Features */}
              <div>
                <div className="mb-8">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full text-sm font-semibold text-primary-pink border border-primary-pink/20 mb-6">
                    {activeTab === 'web' ? '✨ Instant Access' : '🎯 3 Powerful Features'}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
                    {activeTab === 'web' ? 'Try It Right Now' : 'Download the App'}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {activeTab === 'web'
                      ? 'Perfect for trying an outfit before you buy. No commitment needed.'
                      : 'Complete AI fashion assistant with outfit analysis, wardrobe organization & unlimited try-ons.'}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {features[activeTab].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-gray-700 text-lg">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                {activeTab === 'web' ? (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary-pink/30 transition-all duration-300 hover:scale-105"
                  >
                    <span>Start Try-On</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <a
                      href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <span>Download on App Store</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <br />
                    <a
                      href={process.env.NEXT_PUBLIC_ANDROID_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                      <span>Get it on Google Play</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Right - Visual */}
              <div className="relative">
                {activeTab === 'web' ? (
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center relative overflow-hidden border-4 border-white shadow-2xl">
                    <div className="text-center p-8">
                      <div className="text-8xl mb-4">💳</div>
                      <p className="text-gray-700 font-semibold text-lg">Web Virtual Try-On</p>
                      <p className="text-gray-600 mt-2">From $0.50 per try-on</p>
                    </div>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute top-4 right-4 px-4 py-2 bg-white rounded-full shadow-xl border-2 border-primary-pink"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-pink" />
                        <span className="text-sm font-bold text-gray-700">Instant</span>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {/* Display each screenshot twice as requested */}
                    {[1, 2, 3, 1, 2, 3].map((num, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex-shrink-0 w-48"
                      >
                        <div className="relative aspect-[9/19.5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
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
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
