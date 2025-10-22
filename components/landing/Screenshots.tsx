'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Screenshots() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="examples" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
          className="text-center mb-20"
        >
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">See It In Action</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Real Results,</span>{' '}
            <span className="gradient-text">Real Fast</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            See how FitCheck transforms your shopping experience
          </p>
        </motion.div>

        {/* Main Showcase - Large Before/After */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-6xl mx-auto mb-20"
        >
          <div className="border-2 border-gray-200 rounded-3xl p-12 md:p-16 bg-white shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left - Before/After Visual */}
              <div className="grid grid-cols-2 gap-6">
                {/* Before */}
                <div className="relative">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl">
                    <div className="text-center">
                      <div className="text-7xl mb-3">📸</div>
                      <p className="text-sm font-semibold text-gray-600">Your Photo</p>
                    </div>
                    <div className="absolute top-3 left-3 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-700 shadow-lg">
                      Before
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="relative">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary-pink/20 to-secondary-purple/20 rounded-2xl flex items-center justify-center relative overflow-hidden border-4 border-white shadow-2xl">
                    <div className="text-center">
                      <div className="text-7xl mb-3">✨</div>
                      <p className="text-sm font-semibold text-primary-pink">With Outfit</p>
                    </div>
                    <div className="absolute top-3 left-3 px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-xs font-bold shadow-lg">
                      After
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-xl"
                    >
                      <Sparkles className="w-5 h-5 text-primary-pink" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Right - Description */}
              <div>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full text-sm font-semibold text-primary-pink border border-primary-pink/20 mb-6">
                  ✨ AI-Powered Magic
                </div>
                <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-gray-900">
                  See Yourself in Any Outfit
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Upload your photo, choose any clothing item, and get a photorealistic result in seconds. No more guessing how clothes will look on you!
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Upload your photo</h4>
                      <p className="text-gray-600">Full-body, clear, well-lit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Choose your outfit</h4>
                      <p className="text-gray-600">From any online store</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Get instant results</h4>
                      <p className="text-gray-600">In just 5-10 seconds</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/try-on"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary-pink/30 transition-all duration-300 hover:scale-105"
                >
                  <span>Try It Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Grid - Minimal Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { emoji: '👗', title: 'Any Outfit', desc: 'Try clothes from any online store' },
            { emoji: '⚡', title: 'Lightning Fast', desc: 'Results in 5-10 seconds' },
            { emoji: '🎯', title: 'Super Accurate', desc: 'Photorealistic AI results' },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">{item.emoji}</div>
              <h4 className="text-xl font-bold font-poppins mb-2 text-gray-900">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
