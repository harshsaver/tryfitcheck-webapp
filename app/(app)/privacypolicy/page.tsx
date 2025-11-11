import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Database, Zap } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Shield className="w-10 h-10 text-primary-pink" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins">
              <span className="gradient-text">Privacy Policy</span>
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Last Updated: December 11, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="mb-12 bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold font-poppins mb-4 text-gray-900">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              This privacy policy applies to FitCheck (&quot;Application&quot;) developed by WegaLabs (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). This policy describes how we collect, use, and handle your information when you use our service.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12 bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold font-poppins mb-6 text-gray-900">Information We Collect</h2>

            <div className="mb-8">
              <h3 className="text-xl font-bold font-poppins mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary-pink" />
                Personal Information
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700">Email address (for payment processing)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700">Name (for payment processing)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700">Payment information</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700">Photos uploaded for outfit analysis (temporarily stored and encrypted)</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold font-poppins mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-secondary-purple" />
                Usage Data
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                  <span className="text-gray-700">Device&apos;s Internet Protocol address (IP address)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                  <span className="text-gray-700">App usage statistics (time spent, features used)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                  <span className="text-gray-700">Device information (operating system, unique device identifiers)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                  <span className="text-gray-700">Diagnostic data (crash reports, performance data)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary-purple rounded-full mt-2"></div>
                  <span className="text-gray-700">Basic analytics data</span>
                </li>
              </ul>
            </div>
          </section>

          {/* AI Services */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-primary-pink/30">
              <h3 className="text-xl font-bold font-poppins mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary-pink" />
                AI Services and Data Processing
              </h3>
              <p className="text-gray-700 mb-4">
                We utilize several AI services to provide outfit analysis:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>OpenAI (ChatGPT)</strong> - For natural language processing and outfit analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Anthropic (Claude)</strong> - For advanced outfit recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>xAI</strong> - For supplementary analysis features</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Azure APIs</strong> - For image processing and analysis</span>
                </li>
              </ul>
              <p className="text-gray-700 font-semibold">
                All photos are encrypted, temporarily stored only for analysis, and automatically deleted after processing. They are never used for AI model training.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12 bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold font-poppins mb-4 text-gray-900">Third-Party Services</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                <span className="text-gray-700"><strong>Supabase</strong> - For secure data storage and management</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                <span className="text-gray-700"><strong>Mixpanel</strong> - For analytics and user experience improvement</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                <span className="text-gray-700"><strong>RevenueCat</strong> - For payment processing</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-primary-pink to-secondary-purple rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold font-poppins mb-4">Contact Information</h3>
              <p className="mb-2">For privacy-related questions, please contact us at:</p>
              <a href="mailto:support@wegalabs.com" className="text-lg underline hover:opacity-80 transition-opacity">
                support@wegalabs.com
              </a>
            </div>
          </section>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/termsofuse" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Terms of Use</h3>
              <p className="text-gray-600">Read our terms and conditions</p>
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
