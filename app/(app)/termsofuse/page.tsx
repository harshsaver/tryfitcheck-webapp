import Link from 'next/link';
import { ArrowLeft, FileText, AlertCircle, Upload, Sparkles } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-pink transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <Link
              href="/try-on"
              className="px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
            >
              Try Virtual Try-On
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-primary-pink" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins">
              <span className="gradient-text">Terms of Use</span>
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Last Updated: December 11, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Agreement */}
          <section className="mb-12 bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold font-poppins mb-4 text-gray-900">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By using FitCheck, you agree to these Terms of Use. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          {/* Key Terms */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-primary-pink/30">
              <h3 className="text-xl font-bold font-poppins mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-primary-pink" />
                Key Terms
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700">You must be 13 years or older to use this service</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700">You must provide accurate information during registration</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700">You are responsible for maintaining the confidentiality of your account</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700">You agree not to use the service for any illegal purposes</span>
                </li>
              </ul>
            </div>
          </section>

          {/* AI Analysis */}
          <section className="mb-12 bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold font-poppins mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-pink" />
              AI Analysis and Recommendations
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                <span className="text-gray-700">Our AI-powered analyses are provided for informational purposes only</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                <span className="text-gray-700">Recommendations should not be considered as professional fashion advice</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                <span className="text-gray-700">Analysis accuracy may vary and is continuously improving</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                <span className="text-gray-700">Service availability depends on our AI partners (OpenAI, Claude, xAI, Azure)</span>
              </li>
            </ul>
          </section>

          {/* User Content */}
          <section className="mb-12 bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold font-poppins mb-4 flex items-center gap-2">
              <Upload className="w-6 h-6 text-secondary-purple" />
              User Content
            </h2>
            <p className="text-gray-700 mb-4">By uploading photos or content to FitCheck, you:</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                <span className="text-gray-700">Retain your ownership rights</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                <span className="text-gray-700">Grant us permission to analyze your content</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                <span className="text-gray-700">Understand that your photos are temporarily stored for analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                <span className="text-gray-700">Agree not to upload inappropriate or harmful content</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-primary-pink to-secondary-purple rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold font-poppins mb-4">Contact Information</h3>
              <p className="mb-2">For questions about these terms, please contact:</p>
              <a href="mailto:support@wegalabs.com" className="text-lg underline hover:opacity-80 transition-opacity">
                support@wegalabs.com
              </a>
            </div>
          </section>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/privacypolicy" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Privacy Policy</h3>
              <p className="text-gray-600">Learn how we protect your data</p>
            </Link>
            <Link href="/marketing" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Marketing</h3>
              <p className="text-gray-600">Learn about FitCheck features</p>
            </Link>
            <Link href="/support" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Support</h3>
              <p className="text-gray-600">Get help and contact us</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
