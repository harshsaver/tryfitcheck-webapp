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
    <section id="how-it-works" className="py-16 md:py-24 bg-white relative overflow-hidden">
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

        {/* Steps - Single Row Horizontal Scroll */}
        <div className="max-w-7xl mx-auto relative">
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="flex-shrink-0 w-72 group relative"
              >
                {/* Step Card */}
                <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary-pink/30 transition-all duration-500 hover:shadow-xl h-full">
                  {/* Step Number */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-xl flex items-center justify-center shadow-lg mb-4">
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </div>

                  {/* Visual Element */}
                  <div className="text-5xl mb-4 opacity-80">
                    {step.visual}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold font-poppins mb-3 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow Connector */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-primary-pink/40 text-2xl">
                      →
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

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
