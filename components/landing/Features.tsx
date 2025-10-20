'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Shield, Smartphone, Camera, Download, Heart, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Camera,
    title: 'Hyper-Realistic AI',
    description: 'Cutting-edge technology creates photorealistic visualizations. See exactly how clothes will look on your body.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get your AI-powered virtual try-on in just 5-10 seconds. No waiting, instant results.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your photos are processed securely and deleted after 24 hours. We never share your images.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Smartphone,
    title: 'Any Device',
    description: 'Works seamlessly on phone, tablet, or computer. No app download required.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Download,
    title: 'Download & Share',
    description: 'Save your try-on results or share them with friends to get opinions before buying.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Heart,
    title: 'Shop Confidently',
    description: 'Make smarter decisions. Reduce returns and only buy what looks great on you.',
    gradient: 'from-red-500 to-pink-500',
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
      <div className="absolute inset-0 opacity-[0.03]" style={{
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

        {/* Features Grid - Clean Luxury Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold font-poppins mb-4 text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>

                {/* Subtle underline on hover */}
                <div className={`mt-6 h-1 w-0 group-hover:w-16 bg-gradient-to-r ${feature.gradient} transition-all duration-500 rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA - Elegant Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-24 text-center"
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
