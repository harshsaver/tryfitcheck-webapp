'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    emoji: '👗',
    title: 'Instant Outfit Analysis',
    description: 'Get personalized feedback on your fits in seconds! Our AI analyzes your outfit and gives you pro styling tips, color matching advice, and confidence boosting suggestions.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    emoji: '🪄',
    title: 'Virtual Try-On Magic',
    description: 'Try before you buy! See how clothes look on you with our AI try-on feature. Shop smarter and discover styles that perfectly match your vibe.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    emoji: '✨',
    title: 'Smart Wardrobe & Outfits',
    description: 'Organize your closet digitally and let AI create amazing outfit combinations! Mix and match like a pro and never have a "nothing to wear" moment again.',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-10 text-9xl opacity-5 pointer-events-none">
        👗
      </div>
      <div className="absolute bottom-20 left-10 text-9xl opacity-5 pointer-events-none rotate-12">
        ✨
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins gradient-text mb-4">
            Level Up Your Style Game ⭐️
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to look amazing every single day
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="relative p-8 rounded-3xl bg-white border-2 border-gray-100 hover:border-primary-pink transition-all duration-300 shadow-lg hover:shadow-2xl h-full">
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />

                {/* Emoji icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-6xl mb-6 inline-block"
                >
                  {feature.emoji}
                </motion.div>

                <h3 className="text-2xl font-bold font-poppins mb-4 text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-3xl rounded-tr-3xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <a
            href="#download"
            className="inline-block px-8 py-4 bg-gradient-pink text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
          >
            Start Your Glow-Up Journey ✨
          </a>
        </motion.div>
      </div>
    </section>
  );
}
