'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToDownload = () => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary-pink rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-purple rounded-full blur-3xl opacity-20"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-8">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2 text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium"
            >
              ✨ Your AI Fashion Bestie
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-poppins text-white mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="block"
              >
                Level Up Your
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="block bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent"
              >
                Style Game
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed"
            >
              Get instant outfit feedback, try on clothes virtually before buying, and create your dream wardrobe with AI! 💅
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-6"
            >
              <a
                href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <Image
                  src="/images/app-store-badges/appstore.png"
                  alt="Download on App Store"
                  width={160}
                  height={48}
                  className="h-14 w-auto"
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
                  width={160}
                  height={48}
                  className="h-14 w-auto"
                />
              </a>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              onClick={scrollToDownload}
              className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors duration-200"
            >
              Or try Virtual Try-On on web →
            </motion.button>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="md:w-1/2 flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
            >
              <div className="absolute inset-0 bg-white/20 backdrop-blur-lg rounded-full blur-2xl" />
              <Image
                src="/images/logo.png"
                alt="FitCheck AI"
                fill
                className="object-contain drop-shadow-2xl relative z-10"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
