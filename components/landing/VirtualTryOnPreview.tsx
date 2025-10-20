'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function VirtualTryOnPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<'web' | 'app'>('web');

  const features = {
    web: [
      'Pay per try-on ($0.50 each)',
      'No signup required',
      'Instant access',
      'Perfect for one-time use',
      'High-quality AI results',
      'Download & share results',
    ],
    app: [
      'Unlimited try-ons',
      'Outfit analysis & ratings',
      'Smart wardrobe organizer',
      'Style recommendations',
      'Save favorite looks',
      '100% FREE forever',
    ],
  };

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins gradient-text mb-4">
            Choose Your Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Try it on the web now or download our app for unlimited access
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Tab Selector */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-2 bg-gray-100 rounded-full">
              <button
                onClick={() => setActiveTab('web')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'web'
                    ? 'bg-gradient-to-r from-primary-pink to-secondary-purple text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Web Version
              </button>
              <button
                onClick={() => setActiveTab('app')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === 'app'
                    ? 'bg-gradient-to-r from-primary-pink to-secondary-purple text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mobile App
              </button>
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Left Side - Features */}
            <div>
              <h3 className="text-3xl font-bold font-poppins mb-6 text-gray-900">
                {activeTab === 'web' ? 'Try It Right Now' : 'Get the Full Experience'}
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                {activeTab === 'web'
                  ? 'Perfect for trying a quick outfit before you buy. No commitment needed.'
                  : 'Download our app for unlimited virtual try-ons plus powerful wardrobe tools.'}
              </p>

              <ul className="space-y-4 mb-8">
                {features[activeTab].map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {activeTab === 'web' ? (
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-primary-pink/50 transition-all duration-300 hover:scale-105"
                >
                  <span>Start Virtual Try-On</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transform hover:scale-105 transition-transform"
                  >
                    <Image
                      src="/images/app-store-badges/appstore.png"
                      alt="Download on App Store"
                      width={200}
                      height={60}
                      className="h-14 w-auto"
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
                      width={200}
                      height={60}
                      className="h-14 w-auto"
                    />
                  </a>
                </div>
              )}
            </div>

            {/* Right Side - Visual Representation */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                {activeTab === 'web' ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-900">$0.50</span>
                        <span className="text-sm text-gray-500">per try-on</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-gradient-to-r from-primary-pink to-secondary-purple rounded-full" />
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Quick & Easy</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-lg flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <span className="font-semibold">Upload Photo</span>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <span className="font-semibold">Pick Outfit</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <span className="font-semibold">Get Result ✨</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">FREE</div>
                      <p className="text-gray-600">Unlimited Everything</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {['Virtual Try-On', 'Outfit Rating', 'Wardrobe AI', 'Style Tips'].map((feature) => (
                        <div key={feature} className="bg-white rounded-xl p-4 shadow-lg text-center">
                          <div className="text-2xl mb-2">✨</div>
                          <p className="text-sm font-semibold text-gray-700">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-xl font-bold text-sm">
                  {activeTab === 'web' ? 'Instant Access' : 'Most Popular'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
