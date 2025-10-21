'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-pink-900 via-purple-900 to-pink-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="FitCheck AI"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold font-poppins">FitCheck AI</h3>
            </div>
            <p className="text-pink-200 mb-6 max-w-md leading-relaxed">
              Your AI-powered fashion assistant. Get instant outfit feedback, try clothes virtually, and create your dream wardrobe with AI.
            </p>
            <div className="flex gap-4">
              <a
                href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <Image
                  src="/images/app-store-badges/appstore.png"
                  alt="Download on App Store"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
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
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-pink-200 hover:text-white transition-colors duration-200">
                  Features
                </a>
              </li>
              <li>
                <a href="#examples" className="text-pink-200 hover:text-white transition-colors duration-200">
                  Screenshots
                </a>
              </li>
              <li>
                <Link href="/pricing" className="text-pink-200 hover:text-white transition-colors duration-200">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#download" className="text-pink-200 hover:text-white transition-colors duration-200">
                  Download
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-poppins">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@tryfitcheck.com"
                  className="text-pink-200 hover:text-white transition-colors duration-200"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-pink-200 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-pink-200 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://www.tryfitcheck.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-200 hover:text-white transition-colors duration-200"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-pink-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-pink-200 text-sm text-center md:text-left">
              © {currentYear} FitCheck AI. All rights reserved. Made with 💅 for Gen-Z fashionistas.
            </p>
            {/* Social media links removed - add actual URLs when available */}
          </div>
        </div>
      </div>
    </footer>
  );
}
