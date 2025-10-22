'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function ResultContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [isGenerating, setIsGenerating] = useState(true);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session. Please try again.');
      setIsGenerating(false);
      return;
    }

    // Simulate progress while generating
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    // Call generation API
    fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        clearInterval(progressInterval);
        setProgress(100);

        if (data.error) {
          throw new Error(data.error);
        }

        setResultUrl(data.output_url);
        setIsGenerating(false);
      })
      .catch((err) => {
        clearInterval(progressInterval);
        console.error('Generation error:', err);
        setError(err.message || 'Failed to generate try-on. Please contact support.');
        setIsGenerating(false);
      });

    return () => clearInterval(progressInterval);
  }, [sessionId]);

  const handleDownload = async () => {
    if (!resultUrl) return;

    try {
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitcheck-tryon-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image');
    }
  };

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
              New Try-On
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Generating State */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-12">
                <div className="mb-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                  >
                    <Sparkles className="w-16 h-16 text-primary-pink" />
                  </motion.div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
                  Creating Your Virtual Try-On
                </h1>
                <p className="text-gray-600 text-lg mb-8">
                  Our AI is working its magic. This usually takes 5-15 seconds...
                </p>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-pink to-secondary-purple rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{Math.round(progress)}% complete</p>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="text-sm">Please don&apos;t close this page</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="bg-white rounded-3xl shadow-xl border-2 border-red-200 p-12">
                <div className="mb-6">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4 text-gray-900">
                  Something Went Wrong
                </h1>
                <p className="text-red-600 text-lg mb-8 max-w-md mx-auto">
                  {error}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/try-on"
                    className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </Link>
                  <a
                    href="mailto:support@tryfitcheck.com"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary-pink transition-all inline-flex items-center justify-center"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {resultUrl && !isGenerating && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="inline-block mb-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-primary-pink to-secondary-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-3">
                  Your Try-On is Ready!
                </h1>
                <p className="text-gray-600 text-lg">
                  Here&apos;s how the outfit looks on you
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 md:p-12">
                {/* Result Image */}
                <div className="relative aspect-[3/4] max-w-lg mx-auto rounded-2xl overflow-hidden border-2 border-primary-pink/50 mb-8">
                  <Image
                    src={resultUrl}
                    alt="Virtual Try-On Result"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleDownload}
                    className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </button>
                  <Link
                    href="/try-on"
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary-pink transition-all inline-flex items-center justify-center"
                  >
                    Try Another Outfit
                  </Link>
                </div>

                {/* Share prompt */}
                <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                  <p className="text-gray-600 mb-4">Love your result? Share it with friends!</p>
                  <p className="text-sm text-gray-500">
                    Tag us <span className="font-semibold text-primary-pink">@fitcheckAI</span> on social media
                  </p>
                </div>
              </div>

              {/* Download App CTA */}
              <div className="mt-8 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 border-2 border-primary-pink/30">
                <div className="text-center">
                  <h3 className="text-2xl font-bold font-poppins mb-3">Want More Features?</h3>
                  <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                    Download the FitCheck app for unlimited try-ons, AI outfit ratings, wardrobe organization, and personalized style recommendations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={process.env.NEXT_PUBLIC_IOS_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-black text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
                    >
                      Download on App Store
                    </a>
                    <a
                      href={process.env.NEXT_PUBLIC_ANDROID_APP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-black text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2"
                    >
                      Get it on Google Play
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-pink animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
