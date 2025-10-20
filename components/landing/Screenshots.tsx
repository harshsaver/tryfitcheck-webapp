'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const examples = [
  {
    title: 'Before & After',
    description: 'See the incredible transformation',
    beforeEmoji: '📸',
    afterEmoji: '✨',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Any Outfit',
    description: 'Try clothes from any online store',
    beforeEmoji: '👕',
    afterEmoji: '💫',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Instant Results',
    description: 'Get your try-on in seconds',
    beforeEmoji: '⏱️',
    afterEmoji: '🎉',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export default function Screenshots() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="examples" className="py-20 md:py-32 bg-gradient-to-br from-purple-50 via-pink-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-pink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins gradient-text mb-4">
            Real Results, Real Fast
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how FitCheck transforms your shopping experience with AI-powered virtual try-ons
          </p>
        </motion.div>

        {/* Example Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {examples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-pink">
                {/* Before/After comparison */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Before */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                    <div className="text-6xl">{example.beforeEmoji}</div>
                    <div className="absolute top-2 left-2 px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 shadow">
                      Before
                    </div>
                  </div>

                  {/* After */}
                  <div className={`relative aspect-square bg-gradient-to-br ${example.gradient} opacity-20 rounded-2xl flex items-center justify-center`}>
                    <div className="text-6xl">{example.afterEmoji}</div>
                    <div className="absolute top-2 left-2 px-3 py-1 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-xs font-semibold shadow">
                      After
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold font-poppins mb-2 text-gray-900">
                  {example.title}
                </h3>
                <p className="text-gray-600">
                  {example.description}
                </p>

                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${example.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 rounded-3xl p-12 shadow-2xl overflow-hidden">
            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left - Text */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-semibold mb-6 shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-gray-700">Featured Example</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
                  See Yourself in Any Outfit
                </h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Upload your photo, pick any clothing item from the web, and get a photorealistic result in seconds. No more guessing how clothes will look on you!
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Works with any body type</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Try clothes from any website</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">Results in 5-10 seconds</span>
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-primary-pink/50 transition-all duration-300 hover:scale-105"
                >
                  <span>Try It Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Right - Visual placeholder */}
              <div className="relative">
                {/* Large before/after showcase */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="relative aspect-[3/4] bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-3">📸</div>
                        <p className="text-sm font-semibold text-gray-600">Your Photo</p>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-4 py-2 bg-white rounded-full text-sm font-bold text-gray-700 shadow-lg">
                      Before
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative aspect-[3/4] bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-primary-pink">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-pink/20 to-secondary-purple/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-3">✨</div>
                        <p className="text-sm font-semibold text-primary-pink">With New Outfit</p>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-sm font-bold shadow-lg">
                      After
                    </div>
                    <div className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-lg">
                      <Star className="w-5 h-5 text-primary-pink fill-primary-pink" />
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 px-6 py-3 bg-white rounded-full shadow-2xl border-2 border-green-500"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-gray-700">AI Powered</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-pink/20 rounded-full blur-3xl -z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-purple/20 rounded-full blur-3xl -z-0" />
          </div>
        </motion.div>

        {/* Bottom Trust Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-pink to-secondary-purple border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                >
                  {i === 3 ? '✨' : ''}
                </div>
              ))}
            </div>
            <span className="text-gray-700 font-medium ml-2">
              Join <span className="font-bold gradient-text">50,000+</span> happy users
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
