import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Terms of Service - FitCheck AI',
  description: 'Terms of Service for FitCheck AI - Your AI Fashion Assistant',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold font-poppins gradient-text mb-8">
          Terms of Service
        </h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Please read these Terms of Service carefully before using the FitCheck AI mobile application and website operated by Wega Labs.
          </p>

          <h2 className="text-2xl font-bold font-poppins mt-8 mb-4">Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            By accessing and using FitCheck AI, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-bold font-poppins mt-8 mb-4">Use License</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Permission is granted to temporarily download one copy of FitCheck AI for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-bold font-poppins mt-8 mb-4">Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:support@tryfitcheck.com" className="text-primary-pink hover:underline">
              support@tryfitcheck.com
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
