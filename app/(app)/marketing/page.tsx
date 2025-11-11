import Link from 'next/link';
import { ArrowLeft, Sparkles, Brain, Eye, Palette, Calendar, User } from 'lucide-react';

export default function MarketingPage() {
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            <span className="text-gray-900">Transform Your Style</span>{' '}
            <span className="gradient-text">with AI</span>
          </h1>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-12 border-2 border-primary-pink/30 text-center">
            <h2 className="text-3xl font-bold font-poppins mb-4 gradient-text">
              Your Personal AI Style Assistant
            </h2>
            <p className="text-lg text-gray-700">
              FitCheck uses advanced AI technology to analyze your outfits and provide personalized style recommendations, helping you look and feel your best every day.
            </p>
          </div>
        </div>

        {/* Premium Features */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-3xl font-bold font-poppins text-center mb-10">Premium Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Sparkles className="w-6 h-6 text-primary-pink" />
                </div>
                <h3 className="text-xl font-bold font-poppins">Instant Outfit Analysis</h3>
              </div>
              <p className="text-gray-600">Get detailed feedback on your outfits in seconds</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <User className="w-6 h-6 text-secondary-purple" />
                </div>
                <h3 className="text-xl font-bold font-poppins">Style Recommendations</h3>
              </div>
              <p className="text-gray-600">Receive personalized suggestions based on your body type and preferences</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Palette className="w-6 h-6 text-primary-pink" />
                </div>
                <h3 className="text-xl font-bold font-poppins">Color Coordination</h3>
              </div>
              <p className="text-gray-600">Learn which colors work best together and for your complexion</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Calendar className="w-6 h-6 text-secondary-purple" />
                </div>
                <h3 className="text-xl font-bold font-poppins">Occasion Matching</h3>
              </div>
              <p className="text-gray-600">Get outfit recommendations for any event or setting</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:shadow-xl transition-all md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <Eye className="w-6 h-6 text-primary-pink" />
                </div>
                <h3 className="text-xl font-bold font-poppins">Body Type Analysis</h3>
              </div>
              <p className="text-gray-600">Understand what styles complement your unique shape</p>
            </div>
          </div>
        </div>

        {/* Advanced AI Technology */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl p-12 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <Brain className="w-8 h-8 text-primary-pink" />
              <h2 className="text-3xl font-bold font-poppins">Advanced AI Technology</h2>
            </div>
            <p className="text-lg text-gray-700 text-center mb-6">
              Powered by leading AI technologies including:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full"></div>
                <span className="text-gray-700">OpenAI ChatGPT for natural language understanding</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary-purple rounded-full"></div>
                <span className="text-gray-700">Claude for sophisticated style analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-pink rounded-full"></div>
                <span className="text-gray-700">Azure Computer Vision for detailed image processing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary-purple rounded-full"></div>
                <span className="text-gray-700">xAI for enhanced recommendations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-primary-pink to-secondary-purple rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold font-poppins mb-4">Get Started Today</h3>
            <p className="text-lg mb-6 opacity-90">
              Download FitCheck from the App Store or Google Play Store
            </p>
            <p className="text-sm opacity-90">
              Questions? Contact:{' '}
              <a href="mailto:support@wegalabs.com" className="underline hover:opacity-80 transition-opacity">
                support@wegalabs.com
              </a>
            </p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="max-w-5xl mx-auto mt-16">
          <h3 className="text-2xl font-bold font-poppins text-center mb-8">More Information</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/privacypolicy" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Privacy Policy</h3>
              <p className="text-gray-600">Learn how we protect your data</p>
            </Link>
            <Link href="/termsofuse" className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary-pink hover:shadow-xl transition-all text-center group">
              <h3 className="text-xl font-bold font-poppins mb-2 group-hover:text-primary-pink transition-colors">Terms of Use</h3>
              <p className="text-gray-600">Read our terms and conditions</p>
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
