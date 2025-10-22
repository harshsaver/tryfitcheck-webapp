'use client';

import { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  title: string;
  description: string;
  icon?: string;
  accept?: string;
  onImageSelect?: (file: File) => void;
  allowUrl?: boolean;
}

export default function ImageUpload({
  title,
  description,
  icon = '📸',
  accept = 'image/*',
  onImageSelect,
  allowUrl = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setFileName(file.name);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call callback
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput);
      setFileName('Image from URL');
      setUrlInput('');
    }
  };

  const clearImage = () => {
    setPreview(null);
    setFileName('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold font-poppins mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      {!preview ? (
        <>
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-primary-pink bg-pink-50 scale-105'
                : 'border-gray-300 hover:border-primary-pink hover:bg-gray-50'
            }`}
          >
            <div className="text-6xl mb-4">{icon}</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Upload className="w-5 h-5 text-gray-600" />
              <p className="text-gray-700 font-semibold">
                {isDragging ? 'Drop it here!' : 'Drag & drop your image here'}
              </p>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              or click to browse files
            </p>
            <div className="inline-block">
              <button className="px-6 py-3 bg-gradient-to-r from-primary-pink to-secondary-purple text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
                Choose File
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Supports: JPG, PNG, WEBP • Max size: 10MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />

          {/* URL Input Option */}
          {allowUrl && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-gray-500 text-sm">
                    Or paste image URL
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-full focus:border-primary-pink focus:outline-none"
                />
                <button
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                  className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Load
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Preview */
        <div className="border-2 border-primary-pink rounded-2xl p-6 bg-gradient-to-br from-white to-pink-50/30">
          <div className="flex items-start gap-4">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <p className="font-semibold text-gray-900">Image uploaded successfully</p>
              </div>
              <p className="text-sm text-gray-600 truncate mb-4">{fileName}</p>
              <button
                onClick={clearImage}
                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-full font-medium transition-all"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
