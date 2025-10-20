'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Smartphone, Zap, Sparkles, CreditCard, Download, ArrowRight } from 'lucide-react';

export default function AppDownload() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="download" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-pink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-purple/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins gradient-text mb-4">
            Choose Your Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with virtual try-on instantly or unlock unlimited features with our free app
          </p>
        </motion.div>

        {/* Two Options Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {/* Option 1: Web Try-On (Primary CTA) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-pink to-secondary-purple rounded-3xl opacity-50 group-hover:opacity-75 blur-xl transition-opacity duration-300" />
            <div className="relative bg-white rounded-3xl p-10 shadow-2xl h-full flex flex-col">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white text-sm font-bold rounded-full mb-6 self-start">
                <Zap className="w-4 h-4" />
                <span>INSTANT ACCESS</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-3 text-gray-900">
                Try It Right Now
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Perfect for trying a quick outfit before you buy. No commitment needed.
              </p>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold gradient-text">$0.50</span>
                  <span className="text-gray-600">per try-on</span>
                </div>
                <p className="text-sm text-gray-600">Pay only for what you use</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">No signup or app download required</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Results in 5-10 seconds</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Download and share your results</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Secure payment with Stripe</span>
                </li>
              </ul>

              {/* CTA */}
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-primary-pink/50 transition-all duration-300 hover:scale-105"
              >
                <CreditCard className="w-5 h-5" />
                <span>Start Virtual Try-On</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Option 2: Mobile App (Secondary CTA) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
            <div className="relative bg-white rounded-3xl p-10 shadow-2xl border-2 border-gray-100 h-full flex flex-col">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full mb-6 self-start">
                <Sparkles className="w-4 h-4" />
                <span>UNLIMITED FREE</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-3 text-gray-900">
                Download the App
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Get the complete FitCheck experience with unlimited try-ons and more.
              </p>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">FREE</span>
                  <span className="text-gray-600">forever</span>
                </div>
                <p className="text-sm text-gray-600">Unlimited everything, no credit card needed</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Unlimited virtual try-ons</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">AI outfit analysis & ratings</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Smart wardrobe organizer</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Personalized style recommendations</span>
                </li>
              </ul>

              {/* CTA */}
              <div className="space-y-3">
                <a
                  href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-900 transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Download on App Store</span>
                  </div>
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_ANDROID_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-900 transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Get it on Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 rounded-3xl p-8 md:p-12 shadow-xl text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-pink/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-purple/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold font-poppins mb-3 text-gray-900">
                Not sure which option to choose?
              </h3>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Start with the web version to try it out, then download the app for unlimited access to all features!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-bold text-lg shadow-xl hover:shadow-primary-pink/50 transition-all duration-300 hover:scale-105"
                >
                  <span>Try Web Version</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-gray-200"
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Get the App</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
