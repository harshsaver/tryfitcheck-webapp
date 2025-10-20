'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Sparkles, Zap, Download } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Photo',
    description: 'Choose a full-body photo where you&apos;re standing straight. Our AI works best with clear, well-lit images.',
    visual: '📸',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Select Your Outfit',
    description: 'Paste a link to any clothing item from your favorite online store or upload a product image.',
    visual: '👗',
  },
  {
    number: '03',
    icon: Zap,
    title: 'AI Magic Happens',
    description: 'Our advanced AI creates a photorealistic visualization of you wearing the outfit in just 5-10 seconds.',
    visual: '✨',
  },
  {
    number: '04',
    icon: Download,
    title: 'Download & Decide',
    description: 'Save your try-on result, share with friends, and make confident purchase decisions.',
    visual: '💫',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
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
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">How It Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Four Simple Steps to</span>
            <br />
            <span className="gradient-text">Your Perfect Look</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your shopping experience in less than a minute
          </p>
        </motion.div>

        {/* Steps Grid - Premium Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="group relative"
              >
                {/* Step Card */}
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-10 border border-gray-200 hover:border-primary-pink/30 transition-all duration-500 hover:shadow-2xl">
                  {/* Step Number - Large & Elegant */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>

                  {/* Visual Element */}
                  <div className="mb-8 flex items-center justify-between">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-primary-pink" strokeWidth={1.5} />
                    </div>
                    <div className="text-7xl opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                      {step.visual}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl md:text-3xl font-bold font-poppins mb-4 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connecting Line for Desktop */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-8 lg:-right-12 w-8 lg:w-12 h-0.5 bg-gradient-to-r from-primary-pink/50 to-transparent"
                      style={{
                        transform: index % 2 === 0 ? 'translateY(-50%)' : 'translateY(-50%) rotate(90deg) translateX(100px)',
                        transformOrigin: 'left center'
                      }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary-pink/30 transition-all duration-300 hover:scale-105"
          >
            <span>Start Your First Try-On</span>
            <Sparkles className="w-5 h-5" />
          </Link>
          <p className="mt-6 text-gray-500 text-sm">
            No signup required • Results in 5-10 seconds • From $0.50
          </p>
        </motion.div>
      </div>
    </section>
  );
}
