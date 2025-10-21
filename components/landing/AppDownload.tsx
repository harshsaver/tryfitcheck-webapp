'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Zap, Sparkles, ArrowRight, Check } from 'lucide-react';

export default function AppDownload() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="download" className="py-16 md:py-24 bg-white relative overflow-hidden">
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
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Get Started</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Choose Your</span>{' '}
            <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Start instantly on web or get the full experience with our premium app
          </p>
        </motion.div>

        {/* Two Options - Clean Side by Side */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Web Try-On - Primary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="border-2 border-primary-pink/50 rounded-3xl p-12 bg-gradient-to-br from-white to-pink-50/30 h-full flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-500">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white text-sm font-bold rounded-full mb-6 self-start shadow-lg">
                <Zap className="w-4 h-4" />
                <span>INSTANT ACCESS</span>
              </div>

              {/* Title & Price */}
              <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-3 text-gray-900">
                Web Try-On
              </h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-5xl font-bold gradient-text">$0.50</span>
                  <span className="text-gray-600 text-lg">per try-on</span>
                </div>
                <p className="text-gray-600">Perfect for quick decisions</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-10 flex-grow">
                {[
                  'No signup required',
                  'Results in 5-10 seconds',
                  'High-quality AI',
                  'Download & share',
                  'Secure payment',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary-pink/30 transition-all duration-300 hover:scale-105"
              >
                <span>Start Try-On</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Mobile App - Secondary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="border-2 border-gray-200 rounded-3xl p-12 bg-white h-full flex flex-col shadow-xl hover:shadow-2xl transition-shadow duration-500">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full mb-6 self-start shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>3 POWERFUL FEATURES</span>
              </div>

              {/* Title & Price */}
              <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-3 text-gray-900">
                FitCheck Premium
              </h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Premium</span>
                  <span className="text-gray-600 text-lg">subscription</span>
                </div>
                <p className="text-gray-600">Complete AI fashion assistant</p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-10 flex-grow">
                {[
                  'AI outfit analysis & ratings',
                  'Smart wardrobe organizer',
                  'Unlimited virtual try-ons',
                  'Personalized style tips',
                  'Mix & match from closet',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-10 py-5 bg-black text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>App Store</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_ANDROID_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-10 py-5 bg-black text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>Google Play</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 text-lg">
            Not sure which to choose? <Link href="/pricing" className="text-primary-pink font-semibold hover:underline">Try web first</Link>, then download the app for the complete experience
          </p>
        </motion.div>
      </div>
    </section>
  );
}
