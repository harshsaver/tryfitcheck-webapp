'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Screenshots', href: '#examples' },
    { name: 'Download', href: '#download' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="FitCheck AI"
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className={`text-xl md:text-2xl font-bold font-poppins transition-colors duration-300 ${
              isScrolled ? 'gradient-text' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
            }`}>
              FitCheck AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors duration-200 hover:text-primary-pink ${
                  isScrolled ? 'text-gray-700' : 'text-white hover:text-pink-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/pricing"
              className="px-6 py-2.5 bg-gradient-pink text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Try Now ✨
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100/10 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="container mx-auto px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-primary-pink font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-6 py-3 bg-gradient-pink text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
              >
                Try Now ✨
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
