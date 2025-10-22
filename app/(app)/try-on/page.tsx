'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TryOnPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMode, setSelectedMode] = useState('balanced');

  const steps = [
    { number: 1, title: 'Upload Your Photo', description: 'Full-body photo works best' },
    { number: 2, title: 'Upload Garment', description: 'The outfit you want to try' },
    { number: 3, title: 'Configure & Generate', description: 'Select options and create' },
  ];

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
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full text-sm font-semibold">
                <Sparkles className="w-4 h-4 inline mr-2" />
                3 Credits
              </div>
            </div>
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

                {/* Image Upload Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary-pink transition-colors cursor-pointer">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-gray-700 font-semibold mb-2">Drag & drop your photo here</p>
                  <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold">
                    Choose File
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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

                {/* Garment Upload Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary-pink transition-colors cursor-pointer">
                  <div className="text-6xl mb-4">👗</div>
                  <p className="text-gray-700 font-semibold mb-2">Drag & drop garment image</p>
                  <p className="text-gray-500 text-sm mb-4">or paste a product URL</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold">
                    Choose File
                  </button>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary-pink transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
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
                      { id: 'performance', name: 'Performance', time: '~5s', cost: '$0.50' },
                      { id: 'balanced', name: 'Balanced', time: '~8s', cost: '$0.75' },
                      { id: 'quality', name: 'Quality', time: '~12s', cost: '$1.00' },
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
                        {selectedMode === 'performance' ? '$0.50' : selectedMode === 'quality' ? '$1.00' : '$0.75'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:border-primary-pink transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    className="px-8 py-4 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Try-On
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

            {/* Tips List */}
            <ul className="space-y-2 text-gray-600 mb-8 max-w-2xl mx-auto">
              <li>• Use well-lit photos with clear visibility</li>
              <li>• Full-body photos work better than cropped images</li>
              <li>• Stand straight and face the camera directly</li>
              <li>• Choose garments with clear, visible details</li>
            </ul>

            {/* Example Images */}
            <div>
              <h4 className="font-semibold text-lg mb-6 text-center">See Example Results</h4>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Example 1 - Person */}
                <div className="text-center">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-3">
                    <div>
                      <div className="text-6xl mb-2">📸</div>
                      <p className="text-sm font-semibold text-gray-600">Your Photo</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Upload full-body photo</p>
                </div>

                {/* Example 2 - Garment */}
                <div className="text-center">
                  <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-dashed border-primary-pink/50 flex items-center justify-center mb-3">
                    <div>
                      <div className="text-6xl mb-2">👗</div>
                      <p className="text-sm font-semibold text-primary-pink">Outfit</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Clothing item you want</p>
                </div>

                {/* Example 3 - Result */}
                <div className="text-center">
                  <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 via-purple-100 to-pink-100 rounded-2xl border-2 border-primary-pink flex items-center justify-center mb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-pink/10 to-secondary-purple/10 animate-pulse"></div>
                    <div className="relative z-10">
                      <div className="text-6xl mb-2">✨</div>
                      <p className="text-sm font-semibold bg-gradient-to-r from-primary-pink to-secondary-purple bg-clip-text text-transparent">
                        AI Result
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">See yourself wearing it</p>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                * Placeholder images - actual results will show your photo with the garment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
