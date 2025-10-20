'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Shirt, Sparkles, Download } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Photo',
    description: 'Take or upload a clear, full-body photo of yourself. Works with any background!',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Shirt,
    title: 'Choose an Outfit',
    description: 'Pick any clothing item from online stores or upload a product image you want to try.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'AI Magic Happens',
    description: 'Our advanced AI instantly generates a photorealistic try-on in 5-10 seconds.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Download,
    title: 'Get Your Result',
    description: 'Download, share, or save your try-on. Shop with confidence knowing how it looks on YOU!',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-pink/10 rounded-full blur-3xl" />
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
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your perfect virtual try-on in 4 simple steps. No apps, no hassle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -z-10" />
              )}

              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-2 border-gray-100 hover:border-primary-pink h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary-pink to-secondary-purple text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-poppins mb-3 text-gray-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-primary-pink/50 transition-all duration-300 hover:scale-105"
          >
            <span>Start Your First Try-On</span>
            <Sparkles className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-gray-500">
            Join 50,000+ happy users • Takes less than 30 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}
