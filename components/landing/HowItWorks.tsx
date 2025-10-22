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
    description: 'Full-body, well-lit photo',
    action: 'Click to upload',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Select Your Outfit',
    description: 'Paste link or upload image',
    action: 'Browse outfits',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    icon: Zap,
    title: 'AI Processing',
    description: 'Takes only 5-10 seconds',
    action: 'Processing...',
    color: 'from-orange-500 to-red-500',
  },
  {
    number: '04',
    icon: Download,
    title: 'Get Your Result',
    description: 'Download & share instantly',
    action: 'Download now',
    color: 'from-green-500 to-emerald-500',
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

        {/* Interactive Demo Steps */}
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
                <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary-pink/30 transition-all duration-500 hover:shadow-xl h-full overflow-hidden">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center shadow-xl z-10">
                    <span className="text-lg font-bold text-white">{step.number}</span>
                  </div>

                  {/* Interactive Demo Visual */}
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${step.color} opacity-10 rounded-xl mb-4 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-primary-pink/50 transition-all duration-500`}>
                    {/* Step 1: Upload Photo Demo */}
                    {index === 0 && (
                      <div className="text-center relative z-10">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mb-3"
                        >
                          <Upload className="w-16 h-16 text-blue-500 mx-auto" strokeWidth={1.5} />
                        </motion.div>
                        <div className="absolute inset-0 flex items-end justify-center pb-4">
                          <div className="px-3 py-1 bg-white/90 rounded-lg text-xs font-semibold text-gray-700 shadow-lg">
                            📸 person.jpg
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Select Outfit Demo */}
                    {index === 1 && (
                      <div className="grid grid-cols-2 gap-2 p-4">
                        {['👕', '👗', '👔', '🧥'].map((emoji, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.1 }}
                            className={`aspect-square ${i === 1 ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'} rounded-lg flex items-center justify-center text-2xl cursor-pointer`}
                          >
                            {emoji}
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Step 3: AI Processing Demo */}
                    {index === 2 && (
                      <div className="text-center relative">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Zap className="w-16 h-16 text-orange-500 mx-auto" strokeWidth={1.5} />
                        </motion.div>
                        <div className="absolute inset-0 flex items-end justify-center pb-4">
                          <div className="px-3 py-2 bg-orange-100 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <motion.div
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                  className="w-2 h-2 bg-orange-500 rounded-full"
                                />
                                <motion.div
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                  className="w-2 h-2 bg-orange-500 rounded-full"
                                />
                                <motion.div
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                                  className="w-2 h-2 bg-orange-500 rounded-full"
                                />
                              </div>
                              <span className="text-xs font-semibold text-orange-700">AI Processing</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Download Result Demo */}
                    {index === 3 && (
                      <div className="text-center relative">
                        <div className="relative">
                          <div className="text-6xl mb-2">✨</div>
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
                          >
                            <Download className="w-8 h-8 text-green-500" strokeWidth={2} />
                          </motion.div>
                        </div>
                        <div className="absolute inset-0 flex items-end justify-center pb-4">
                          <div className="px-3 py-1 bg-green-100 rounded-lg text-xs font-semibold text-green-700">
                            result.jpg ready!
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-poppins mb-2 text-gray-900">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3">
                    {step.description}
                  </p>

                  {/* Action Button */}
                  <div className={`w-full py-2 px-4 bg-gradient-to-r ${step.color} text-white rounded-lg text-sm font-semibold text-center group-hover:shadow-lg transition-all duration-300`}>
                    {step.action}
                  </div>

                  {/* Arrow Connector */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-primary-pink/40 text-2xl z-20">
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
            href="/try-on"
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
