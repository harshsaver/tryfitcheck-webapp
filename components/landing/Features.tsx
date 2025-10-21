'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Camera, Clock, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'See Yourself in Any Outfit',
    description: 'Upload your photo and any clothing item to get photorealistic try-on results in seconds. Perfect for online shopping decisions.',
    visual: '📸→👗→✨',
    gradient: 'from-purple-500 to-pink-500',
    example: 'Try before you buy from any online store',
  },
  {
    title: 'Instant AI Results',
    description: 'Get your virtual try-on in just 5-10 seconds. No waiting, no complicated setup—just upload and see yourself wearing it.',
    visual: '⚡',
    gradient: 'from-yellow-500 to-orange-500',
    example: 'Lightning-fast processing with hyper-realistic AI',
  },
  {
    title: 'Make Confident Decisions',
    description: 'Reduce returns and buyer&apos;s remorse. See how clothes actually look on YOUR body before spending money.',
    visual: '💰→😊',
    gradient: 'from-green-500 to-emerald-500',
    example: 'Save money by only buying what looks great on you',
  },
  {
    title: 'Privacy & Security First',
    description: 'Your photos are processed securely and automatically deleted after 24 hours. We never share or permanently store your images.',
    visual: '🔒',
    gradient: 'from-blue-500 to-cyan-500',
    example: '100% secure with automatic photo deletion',
  },
];

const stats = [
  { icon: Sparkles, value: '50,000+', label: 'Happy Users' },
  { icon: Camera, value: '100,000+', label: 'Try-Ons Created' },
  { icon: Clock, value: '5-10s', label: 'Average Speed' },
  { icon: Heart, value: '98%', label: 'Satisfaction Rate' },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Why Choose</span>{' '}
            <span className="gradient-text">FitCheck?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The most advanced, secure, and intuitive virtual try-on experience
          </p>
        </motion.div>

        {/* Stats - Premium Minimal Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center">
                <stat.icon className="w-8 h-8 text-primary-pink" strokeWidth={1.5} />
              </div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 font-poppins">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features - Visual Examples */}
        <div className="space-y-16 max-w-6xl mx-auto mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Visual/Image Placeholder */}
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className={`relative aspect-square bg-gradient-to-br ${feature.gradient} opacity-10 rounded-3xl border-2 border-gray-200 flex items-center justify-center overflow-hidden`}>
                  <div className="text-9xl">{feature.visual}</div>
                  <div className="absolute bottom-6 left-6 right-6 px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl">
                    <p className="text-sm font-semibold text-gray-700">
                      {feature.example}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className={`inline-block w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl mb-6 shadow-lg`} />

                <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  {feature.description}
                </p>

                <div className={`h-1 w-20 bg-gradient-to-r ${feature.gradient} rounded-full`} />
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
          <div className="inline-block border-2 border-gray-200 rounded-3xl p-12 max-w-3xl">
            <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
              Ready to see how great you&apos;ll look?
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-xl mx-auto leading-relaxed">
              Join thousands of fashion-forward shoppers making confident purchase decisions with FitCheck.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary-pink/30 transition-all duration-300 hover:scale-105"
            >
              <span>Try Virtual Try-On</span>
              <Sparkles className="w-5 h-5" />
            </Link>
            <p className="mt-6 text-sm text-gray-500">
              From $0.50 per try-on • No commitment required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
