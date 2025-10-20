'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fashion Blogger',
    image: '/images/testimonials/user1.jpg', // Placeholder - you can replace
    rating: 5,
    text: 'Absolutely game-changing! I saved so much money by trying outfits virtually before buying. The AI is scarily accurate!',
    highlight: 'Saved $500+ on returns',
  },
  {
    name: 'Emily Chen',
    role: 'Online Shopper',
    image: '/images/testimonials/user2.jpg', // Placeholder
    rating: 5,
    text: 'I was skeptical at first, but the results are mind-blowing. Looks exactly like a real try-on. No more guessing!',
    highlight: 'Used it 23 times',
  },
  {
    name: 'Jessica Martinez',
    role: 'Style Enthusiast',
    image: '/images/testimonials/user3.jpg', // Placeholder
    rating: 5,
    text: 'This is THE future of online shopping. Why isn\'t every store using this? Absolutely love it!',
    highlight: 'Convinced 5 friends',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 via-pink-50 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 right-20 w-72 h-72 bg-primary-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-secondary-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 font-bold text-gray-900">4.9/5</span>
            <span className="text-gray-500">from 10,000+ reviews</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins gradient-text mb-4">
            Loved by Fashion Enthusiasts
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our users are saying about their virtual try-on experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-pink h-full">
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-pink to-secondary-purple rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Highlight Badge */}
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-sm font-semibold text-primary-pink mb-6">
                  ✨ {testimonial.highlight}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-pink to-secondary-purple flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { label: '50,000+', sublabel: 'Happy Users' },
            { label: '100,000+', sublabel: 'Try-Ons Generated' },
            { label: '4.9/5', sublabel: 'Average Rating' },
            { label: '98%', sublabel: 'Would Recommend' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.label}
              </div>
              <div className="text-gray-600">{stat.sublabel}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
