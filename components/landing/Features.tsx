'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Sparkles, Camera, Clock, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'See Yourself in Any Outfit',
    description: 'Upload your photo and any clothing item to get photorealistic try-on results in seconds. Perfect for online shopping decisions.',
    visual: '📸→👗→✨',
    gradient: 'from-purple-500 to-pink-500',
    example: 'Try before you buy from any online store',
  },
  {
    title: 'Instant AI Results',
    description: 'Get your virtual try-on in just 5-10 seconds. No waiting, no complicated setup—just upload and see yourself wearing it.',
    visual: '⚡',
    gradient: 'from-yellow-500 to-orange-500',
    example: 'Lightning-fast processing with hyper-realistic AI',
  },
  {
    title: 'Make Confident Decisions',
    description: 'Reduce returns and buyer&apos;s remorse. See how clothes actually look on YOUR body before spending money.',
    visual: '💰→😊',
    gradient: 'from-green-500 to-emerald-500',
    example: 'Save money by only buying what looks great on you',
  },
  {
    title: 'Privacy & Security First',
    description: 'Your photos are processed securely and automatically deleted after 24 hours. We never share or permanently store your images.',
    visual: '🔒',
    gradient: 'from-blue-500 to-cyan-500',
    example: '100% secure with automatic photo deletion',
  },
];

const stats = [
  { icon: Sparkles, value: '50,000+', label: 'Happy Users' },
  { icon: Camera, value: '100,000+', label: 'Try-Ons Created' },
  { icon: Clock, value: '5-10s', label: 'Average Speed' },
  { icon: Heart, value: '98%', label: 'Satisfaction Rate' },
];

export default function Features() {
  const ref = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let isPaused = false;
    let animationFrame: number;

    const smoothScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += 1; // Smooth continuous scroll

        // Reset to start when reaching the middle (duplicated content)
        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;
        const halfWay = (scrollWidth - clientWidth) / 2;

        if (scrollContainer.scrollLeft >= halfWay) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(smoothScroll);
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    animationFrame = requestAnimationFrame(smoothScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Minimal background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
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
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Why Choose</span>{' '}
            <span className="gradient-text">FitCheck?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The most advanced, secure, and intuitive virtual try-on experience
          </p>
        </motion.div>

        {/* Stats - Premium Minimal Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-4 flex justify-center">
                <stat.icon className="w-8 h-8 text-primary-pink" strokeWidth={1.5} />
              </div>
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 font-poppins">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features - Horizontal Scrolling Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mb-20"
        >
          {/* Gradient Fades on Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />

          {/* Scrollable Container */}
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-6">
            {/* Render features twice for seamless loop */}
            {[...features, ...features].map((feature, index) => (
              <motion.div
                key={`${feature.title}-${index}`}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: (index % features.length) * 0.1 }}
                className="flex-shrink-0 w-80 md:w-96"
              >
                <div className="border-2 border-gray-200 rounded-3xl p-8 bg-white hover:border-primary-pink/30 transition-all duration-500 hover:shadow-xl h-full">
                  {/* Visual/Image Placeholder */}
                  <div className={`relative aspect-square bg-gradient-to-br ${feature.gradient} opacity-10 rounded-2xl border-2 border-gray-200 flex items-center justify-center overflow-hidden mb-6`}>
                    <div className="text-7xl">{feature.visual}</div>
                    <div className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
                      <p className="text-xs font-semibold text-gray-700">
                        {feature.example}
                      </p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`inline-block w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-lg mb-4 shadow-lg`} />

                  {/* Title */}
                  <h3 className="text-xl font-bold font-poppins mb-3 text-gray-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-block border-2 border-gray-200 rounded-3xl p-12 max-w-3xl">
            <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
              Ready to see how great you&apos;ll look?
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-xl mx-auto leading-relaxed">
              Join thousands of fashion-forward shoppers making confident purchase decisions with FitCheck.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary-pink/30 transition-all duration-300 hover:scale-105"
            >
              <span>Try Virtual Try-On</span>
              <Sparkles className="w-5 h-5" />
            </Link>
            <p className="mt-6 text-sm text-gray-500">
              From $0.50 per try-on • No commitment required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
