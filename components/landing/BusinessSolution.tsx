'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Image as ImageIcon, Users, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const solutions = [
  {
    icon: ImageIcon,
    title: 'Create Realistic On-Model Photos',
    description: 'Transform product photos into professional on-model images. Show your clothes worn by anyone, instantly.',
    visual: '👕→👤→✨',
    gradient: 'from-purple-500 to-pink-500',
    features: ['No photoshoot needed', 'Any model type', 'Product to on-model'],
  },
  {
    icon: Sparkles,
    title: 'Change Clothing on Existing Models',
    description: 'Already have great model photos? Swap outfits using reference images—whether it&apos;s worn or a product shot.',
    visual: '📸→👗→💫',
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Reuse existing shots', 'Try multiple outfits', 'Reference any image'],
  },
  {
    icon: Users,
    title: 'Diversify Your Model Portfolio',
    description: 'Re-use a great shot by trying more clothes on the same model, or change just the model for more diversity.',
    visual: '👤→👥→🌈',
    gradient: 'from-green-500 to-emerald-500',
    features: ['More model diversity', 'Same pose, different models', 'Expand your catalog'],
  },
  {
    icon: Zap,
    title: 'No Training Required',
    description: 'Get try-on results in seconds using a single reference image. No lengthy setup or multi-image training needed.',
    visual: '⚡',
    gradient: 'from-orange-500 to-red-500',
    features: ['Single image input', 'Instant results', 'No technical setup'],
  },
];

export default function BusinessSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">For Businesses</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Professional Virtual Try-On</span>
            <br />
            <span className="gradient-text">For E-Commerce Brands</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create realistic on-model photos, diversify your catalog, and boost conversions—all without expensive photoshoots
          </p>
        </motion.div>

        {/* Main Value Prop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="border-2 border-primary-pink/50 rounded-3xl p-12 bg-gradient-to-br from-white to-pink-50/30">
            <div className="text-center">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-bold mb-6 shadow-lg">
                ⚡ NO TRAINING NEEDED
              </div>
              <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
                Get Try-On Results in Seconds
              </h3>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Use a single reference image—no lengthy setup or multi-image training required. Perfect for fast-moving fashion brands.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 + index * 0.1 }}
            >
              <div className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:border-primary-pink/30 transition-all duration-500 hover:shadow-xl h-full">
                {/* Visual Placeholder */}
                <div className={`relative aspect-video bg-gradient-to-br ${solution.gradient} opacity-10 rounded-xl border-2 border-gray-200 flex items-center justify-center mb-5`}>
                  <div className="text-6xl">{solution.visual}</div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-poppins mb-3 text-gray-900">
                  {solution.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm">
                  {solution.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-block border-2 border-gray-200 rounded-3xl p-12 max-w-3xl bg-white">
            <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
              Ready to Transform Your Product Photos?
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-xl mx-auto leading-relaxed">
              Join leading e-commerce brands using FitCheck to create professional on-model content at scale.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary-pink/30 transition-all duration-300 hover:scale-105"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-6 text-sm text-gray-500">
              From $0.50 per image • Volume pricing available
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
