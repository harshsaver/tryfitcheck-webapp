'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Zap, Shield, Smartphone, Camera, Download, Heart, Sparkles, Clock } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Results',
    description: 'Get your AI-powered virtual try-on in just 5-10 seconds. No waiting, no hassle – instant gratification.',
    gradient: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
  },
  {
    icon: Camera,
    title: 'Hyper-Realistic AI',
    description: 'Powered by cutting-edge AI technology that creates photorealistic try-ons. See exactly how clothes will look on your body.',
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Shield,
    title: '100% Privacy Guaranteed',
    description: 'Your photos are processed securely and deleted after 24 hours. We never share or store your images permanently.',
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: Smartphone,
    title: 'Works Anywhere',
    description: 'Use on any device – phone, tablet, or computer. No app download required for quick try-ons.',
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Download,
    title: 'Download & Share',
    description: 'Save your try-on results to your device or share them with friends to get their opinion before buying.',
    gradient: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50',
  },
  {
    icon: Heart,
    title: 'Shop with Confidence',
    description: 'Make smarter shopping decisions. Reduce returns and only buy clothes you know will look great on you.',
    gradient: 'from-red-500 to-pink-500',
    bgColor: 'bg-red-50',
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
    <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-40 left-20 w-72 h-72 bg-primary-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins gradient-text mb-4">
            Why Choose FitCheck?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The fastest, most accurate, and secure way to try on clothes virtually
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-100 hover:border-primary-pink transition-all duration-300"
            >
              <stat.icon className="w-8 h-8 text-primary-pink mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-pink h-full">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold font-poppins mb-4 text-gray-900">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 text-center"
        >
          <div className="inline-block p-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gray-900">
              Ready to see how great you'll look? ✨
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of fashion-forward shoppers who use FitCheck to make confident purchase decisions.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-primary-pink/50 transition-all duration-300 hover:scale-105"
            >
              <span>Try Virtual Try-On Now</span>
              <Sparkles className="w-5 h-5" />
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Starting at just $0.50 • No commitment required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
