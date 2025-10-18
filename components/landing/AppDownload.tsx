'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const comparison = [
  {
    feature: 'Virtual Try-On',
    web: 'Limited Credits',
    app: 'Unlimited',
    highlight: true,
  },
  {
    feature: 'Outfit Analysis',
    web: '❌',
    app: '✅ Unlimited',
    highlight: true,
  },
  {
    feature: 'Wardrobe Management',
    web: '❌',
    app: '✅ Full Access',
    highlight: true,
  },
  {
    feature: 'Style Recommendations',
    web: '❌',
    app: '✅ AI-Powered',
    highlight: false,
  },
  {
    feature: 'Offline Access',
    web: '❌',
    app: '✅',
    highlight: false,
  },
];

export default function AppDownload() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="download" className="py-20 md:py-32 bg-white relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins gradient-text mb-6">
            Ready to Transform Your Style? ✨
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Get the full FitCheck experience with our mobile app, or try Virtual Try-On right here on the web!
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 md:p-10 shadow-xl border-2 border-primary-pink/20">
            <h3 className="text-2xl md:text-3xl font-bold font-poppins text-center mb-8 text-gray-900">
              Web vs App Comparison
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary-pink/30">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700">Web</th>
                    <th className="text-center py-4 px-4 font-semibold">
                      <span className="bg-gradient-pink text-white px-4 py-2 rounded-full text-sm">
                        Mobile App
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((item, index) => (
                    <motion.tr
                      key={item.feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className={`border-b border-gray-200 ${item.highlight ? 'bg-white/50' : ''}`}
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">{item.feature}</td>
                      <td className="py-4 px-4 text-center text-gray-600">{item.web}</td>
                      <td className="py-4 px-4 text-center font-semibold text-primary-pink">
                        {item.app}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Download Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Mobile App */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-pink rounded-3xl opacity-50 group-hover:opacity-75 blur-lg transition-opacity duration-300" />
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-gradient-pink text-white text-sm font-semibold rounded-full mb-4">
                  RECOMMENDED
                </div>
                <h3 className="text-3xl font-bold font-poppins mb-2">Download the App</h3>
                <p className="text-gray-600">Unlimited everything, forever free</p>
              </div>

              <ul className="space-y-3 mb-8">
                {['✨ Unlimited Virtual Try-Ons', '👗 Full Outfit Analysis', '🎨 Complete Wardrobe Tools', '💅 Personalized Style Tips'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-700">
                    <span className="text-primary-pink">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src="/images/app-store-badges/appstore.png"
                    alt="Download on App Store"
                    width={200}
                    height={60}
                    className="w-full h-auto"
                  />
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_ANDROID_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transform hover:scale-105 transition-transform duration-200"
                >
                  <Image
                    src="/images/app-store-badges/play.png"
                    alt="Get it on Google Play"
                    width={200}
                    height={60}
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Web Try-On */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-3xl opacity-30 group-hover:opacity-50 blur-lg transition-opacity duration-300" />
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-semibold rounded-full mb-4">
                  TRY NOW
                </div>
                <h3 className="text-3xl font-bold font-poppins mb-2">Web Virtual Try-On</h3>
                <p className="text-gray-600">Quick preview before downloading</p>
              </div>

              <ul className="space-y-3 mb-8">
                {['🪄 Virtual Try-On Feature', '💳 Pay per generation', '🚀 No download needed', '⚡ Instant results'].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-700">
                    <span className="text-purple-500">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className="block w-full text-center px-6 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Try Virtual Try-On →
              </Link>

              <p className="text-sm text-gray-500 text-center mt-4">
                Starting at just $0.50 per generation
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
