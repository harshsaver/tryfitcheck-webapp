'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ImageUpload from '@/components/try-on/ImageUpload';
import { getStripe, PRICING, PricingMode } from '@/lib/stripe';
import { uploadImageToStorage } from '@/lib/upload';

export default function TryOnPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Image state
  const [personImageFile, setPersonImageFile] = useState<File | null>(null);
  const [personImageUrl, setPersonImageUrl] = useState('');
  const [garmentImageFile, setGarmentImageFile] = useState<File | null>(null);
  const [garmentImageUrl, setGarmentImageUrl] = useState('');

  // Configuration state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMode, setSelectedMode] = useState<PricingMode>('balanced');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Upload Your Photo', description: 'Full-body photo works best' },
    { number: 2, title: 'Upload Garment', description: 'The outfit you want to try' },
    { number: 3, title: 'Configure & Generate', description: 'Select options and create' },
  ];

  const handlePersonImageSelect = (file: File | null, url: string) => {
    setPersonImageFile(file);
    setPersonImageUrl(url);
    setError(null);
  };

  const handleGarmentImageSelect = (file: File | null, url: string) => {
    setGarmentImageFile(file);
    setGarmentImageUrl(url);
    setError(null);
  };

  const canProceedStep1 = personImageUrl !== '';
  const canProceedStep2 = garmentImageUrl !== '';
  const canGenerate = selectedCategory !== '';

  const handleGenerate = async () => {
    if (!canGenerate) {
      setError('Please select a garment category');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Upload images to storage if they're files (not URLs)
      let finalPersonImageUrl = personImageUrl;
      let finalGarmentImageUrl = garmentImageUrl;

      if (personImageFile) {
        finalPersonImageUrl = await uploadImageToStorage(personImageFile);
      }

      if (garmentImageFile) {
        finalGarmentImageUrl = await uploadImageToStorage(garmentImageFile);
      }

      // Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: selectedMode,
          personImageUrl: finalPersonImageUrl,
          garmentImageUrl: finalGarmentImageUrl,
          category: selectedCategory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      const { error: stripeError } = await stripe!.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
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
              href="/pricing"
              className="px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-primary-pink to-secondary-purple text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.number}
                  </div>
                  <div className="mt-3 text-center">
                    <p className={`font-semibold text-sm ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-300 ${
                    currentStep > step.number ? 'bg-gradient-to-r from-primary-pink to-secondary-purple' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-700 text-center">
              {error}
            </div>
          </div>
        )}

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8 md:p-12">
            {/* Step 1: Upload Person Image */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold font-poppins mb-4 text-center">
                  Upload Your Photo
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Choose a full-body photo where you&apos;re standing straight for best results
                </p>

                <ImageUpload
                  title=""
                  description=""
                  icon="📸"
                  onImageSelect={handlePersonImageSelect}
                  allowUrl={false}
                />

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canProceedStep1}
                    className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Upload Garment Image */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold font-poppins mb-4 text-center">
                  Upload Garment
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Upload the clothing item or paste a link from any online store
                </p>

                <ImageUpload
                  title=""
                  description=""
                  icon="👗"
                  onImageSelect={handleGarmentImageSelect}
                  allowUrl={true}
                />

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary-pink transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    disabled={!canProceedStep2}
                    className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Configure & Generate */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold font-poppins mb-4 text-center">
                  Configure & Generate
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Choose your options and create your virtual try-on
                </p>

                {/* Category Selection */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">Garment Category</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['Tops', 'Bottoms', 'One-Pieces'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`p-6 border-2 rounded-2xl font-semibold transition-all ${
                          selectedCategory === category
                            ? 'border-primary-pink bg-pink-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode Selection */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">Generation Mode</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'performance' as PricingMode, name: 'Performance', time: '~5s', cost: PRICING.performance.display },
                      { id: 'balanced' as PricingMode, name: 'Balanced', time: '~8s', cost: PRICING.balanced.display },
                      { id: 'quality' as PricingMode, name: 'Quality', time: '~12s', cost: PRICING.quality.display },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`p-6 border-2 rounded-2xl transition-all ${
                          selectedMode === mode.id
                            ? 'border-primary-pink bg-pink-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <p className="font-semibold mb-2">{mode.name}</p>
                        <p className="text-sm text-gray-600">{mode.time}</p>
                        <p className="text-sm font-bold text-primary-pink mt-2">{mode.cost}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-primary-pink/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your selection</p>
                      <p className="font-bold text-gray-900">
                        {selectedCategory || 'Select category'} • {selectedMode} mode
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total cost</p>
                      <p className="text-2xl font-bold text-primary-pink">
                        {PRICING[selectedMode].display}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={isLoading}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading || !canGenerate}
                    className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Try-On
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Tips & Examples Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-bold font-poppins mb-6 text-center">💡 Tips for Best Results</h3>

            <ul className="space-y-3 mb-10 max-w-2xl mx-auto">
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span className="text-gray-700">Use a full-body photo with clear visibility of your body shape</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span className="text-gray-700">Stand straight with arms slightly away from your body</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span className="text-gray-700">Choose garment images with clear, frontal view and good lighting</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-pink mt-1">•</span>
                <span className="text-gray-700">Quality mode gives the most realistic results but takes longer</span>
              </li>
            </ul>

            <h4 className="text-xl font-bold font-poppins mb-6 text-center">See Example Results</h4>
            <p className="text-center text-gray-500 text-sm mb-6">Here&apos;s how the AI transforms your photos into realistic try-ons</p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Example 1 - Person */}
              <div className="text-center">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center mb-4 border-2 border-gray-300">
                  <div className="text-6xl mb-2">📸</div>
                  <p className="text-sm font-semibold text-gray-600">Step 1</p>
                </div>
                <p className="font-semibold text-gray-900 mb-1">Your Photo</p>
                <p className="text-sm text-gray-600">Upload a full-body photo</p>
              </div>

              {/* Example 2 - Garment */}
              <div className="text-center">
                <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex flex-col items-center justify-center mb-4 border-2 border-purple-300">
                  <div className="text-6xl mb-2">👗</div>
                  <p className="text-sm font-semibold text-gray-600">Step 2</p>
                </div>
                <p className="font-semibold text-gray-900 mb-1">Outfit</p>
                <p className="text-sm text-gray-600">Add the garment you want</p>
              </div>

              {/* Example 3 - Result */}
              <div className="text-center">
                <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 via-purple-100 to-pink-100 rounded-2xl flex flex-col items-center justify-center mb-4 border-2 border-primary-pink animate-pulse">
                  <div className="text-6xl mb-2">✨</div>
                  <p className="text-sm font-semibold text-gray-600">Step 3</p>
                </div>
                <p className="font-semibold text-gray-900 mb-1">AI Result</p>
                <p className="text-sm text-gray-600">Get your realistic try-on</p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              * Example images coming soon. These are placeholder illustrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
