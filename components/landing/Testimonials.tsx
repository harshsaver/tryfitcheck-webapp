'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Users, TrendingUp, Award } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Blogger, NYC',
    initials: 'SJ',
    rating: 5,
    text: 'Absolutely game-changing! I saved so much money by trying outfits virtually before buying. The AI is scarily accurate!',
    highlight: 'Saved $500+ on returns',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'Emily Chen',
    role: 'Online Shopper, LA',
    initials: 'EC',
    rating: 5,
    text: 'I was skeptical at first, but the results are mind-blowing. Looks exactly like a real try-on. No more guessing!',
    highlight: 'Used it 23 times',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Jessica Martinez',
    role: 'Style Enthusiast, Miami',
    initials: 'JM',
    rating: 5,
    text: 'This is THE future of online shopping. Why isn&apos;t every store using this? Absolutely love it!',
    highlight: 'Convinced 5 friends',
    color: 'from-cyan-500 to-blue-500',
  },
];

const stats = [
  { icon: Users, value: '50,000+', label: 'Fashion Lovers' },
  { icon: TrendingUp, value: '100,000+', label: 'Try-Ons Created' },
  { icon: Award, value: '98%', label: 'Recommend Us' },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
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
            <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Loved by Thousands of</span>{' '}
            <span className="gradient-text">Fashion Enthusiasts</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-lg text-gray-600">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-semibold text-gray-900">4.9/5</span>
            <span>from 10,000+ reviews</span>
          </div>
        </motion.div>

        {/* Testimonials Grid - Premium Minimal */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.15 }}
            >
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary-pink/30 transition-all duration-500 hover:shadow-xl h-full flex flex-col">
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 leading-relaxed text-lg mb-6 flex-grow italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Highlight Badge */}
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-full text-sm font-semibold text-primary-pink border border-primary-pink/20">
                    ✨ {testimonial.highlight}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section - Clean Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="border-2 border-gray-200 rounded-3xl p-12">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <div className="mb-4 flex justify-center">
                    <stat.icon className="w-10 h-10 text-primary-pink" strokeWidth={1.5} />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 font-poppins">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
