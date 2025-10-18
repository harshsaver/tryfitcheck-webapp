'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const screenshots = [
  { src: '/images/screenshots/screenshot1.png', alt: 'FitCheck AI Outfit Analysis' },
  { src: '/images/screenshots/screenshot2.png', alt: 'Virtual Try-On Feature' },
  { src: '/images/screenshots/screenshot3.png', alt: 'Wardrobe Management' },
];

export default function Screenshots() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="screenshots" className="py-20 md:py-32 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-64 h-64 border-4 border-primary-pink rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-64 h-64 border-4 border-secondary-purple rounded-full"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins gradient-text mb-6">
            See the Magic ✨
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Join thousands of fashionistas who are already slaying their style game with FitCheck AI
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {screenshots.map((screenshot, index) => (
            <motion.div
              key={screenshot.alt}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: "easeOut"
              }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="perspective-1000"
            >
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-pink via-secondary-purple to-accent-cyan rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

                {/* Screenshot container */}
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                  <Image
                    src={screenshot.src}
                    alt={screenshot.alt}
                    width={400}
                    height={800}
                    className="w-full h-auto"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-pink border-2 border-white"
                />
              ))}
            </div>
            <span className="text-gray-700 font-medium ml-2">
              Join <span className="font-bold text-primary-pink">10,000+</span> happy users
            </span>
            <span className="text-2xl">🎉</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
