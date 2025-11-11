import Link from 'next/link';
import { ArrowLeft, HelpCircle, Mail, Clock, Sparkles, Shield, CheckCircle } from 'lucide-react';

export default function SupportPage() {
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
            <HelpCircle className="w-10 h-10 text-primary-pink" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins">
              <span className="gradient-text">Support Center</span>
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Quick Support Guide */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 border-2 border-primary-pink/30 text-center">
              <h2 className="text-2xl font-bold font-poppins mb-4 gradient-text">Quick Support Guide</h2>
              <p className="text-gray-700">
                Find answers to common questions and get the help you need to make the most of FitCheck.
              </p>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold font-poppins mb-6 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold font-poppins mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-pink" />
                  How does FitCheck analyze my outfits?
                </h3>
                <p className="text-gray-700">
                  FitCheck uses advanced AI technology from leading providers including OpenAI, Claude, xAI, and Azure to analyze your outfits and provide personalized recommendations. Your photos are processed securely and automatically deleted after analysis.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold font-poppins mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-pink" />
                  Is my data secure?
                </h3>
                <p className="text-gray-700">
                  Yes! All photos and personal information are encrypted and securely stored. Photos are only temporarily stored for analysis and automatically deleted afterward. We never use your photos for AI training.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold font-poppins mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary-pink" />
                  How accurate are the recommendations?
                </h3>
                <p className="text-gray-700">
                  Our AI-powered recommendations are highly accurate and continuously improving. However, they should be used as guidance rather than absolute rules. Fashion is personal, and we encourage you to use our suggestions as inspiration.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200">
                <h3 className="text-xl font-bold font-poppins mb-3 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary-pink" />
                  What if I&apos;m having technical issues?
                </h3>
                <ul className="space-y-2 mt-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                    <span className="text-gray-700">Ensure you have the latest version of the app</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                    <span className="text-gray-700">Check your internet connection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                    <span className="text-gray-700">Try closing and reopening the app</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary-pink rounded-full mt-2"></div>
                    <span className="text-gray-700">Contact support if issues persist</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Premium Support */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-primary-pink/30">
              <h3 className="text-xl font-bold font-poppins mb-3 flex items-center gap-2 justify-center">
                <Sparkles className="w-6 h-6 text-primary-pink" />
                Premium Support
              </h3>
              <p className="text-gray-700 text-center">
                Premium users receive priority support with response times under 12 hours. Our dedicated team is here to help you make the most of your FitCheck experience.
              </p>
            </div>
          </section>

          {/* Contact Methods */}
          <section className="mb-12 bg-white rounded-2xl p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold font-poppins mb-6 text-center">Contact Methods</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-pink mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Email Support:</strong>
                  <span className="text-gray-700"> For detailed questions and account-specific issues</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-secondary-purple mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">In-App Help:</strong>
                  <span className="text-gray-700"> Quick access to guides and FAQs</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary-pink mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Social Media:</strong>
                  <span className="text-gray-700"> Follow us for updates and tips</span>
                </div>
              </li>
            </ul>
          </section>

          {/* Get in Touch */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-primary-pink to-secondary-purple rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold font-poppins mb-4">Get in Touch</h3>
              <p className="mb-4">
                Our support team is available 24/7 to help you with any questions or concerns.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span>Email:</span>
                  <a href="mailto:support@wegalabs.com" className="underline hover:opacity-80 transition-opacity">
                    support@wegalabs.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Response Time: Within 24 hours (12 hours for premium users)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/privacypolicy" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Privacy Policy</h3>
              <p className="text-gray-600">Learn how we protect your data</p>
            </Link>
            <Link href="/termsofuse" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Terms of Use</h3>
              <p className="text-gray-600">Read our terms and conditions</p>
            </Link>
            <Link href="/marketing" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Marketing</h3>
              <p className="text-gray-600">Learn about FitCheck features</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
