import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Privacy Policy - FitCheck AI',
  description: 'Privacy policy for FitCheck AI - Your AI Fashion Assistant',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold font-poppins gradient-text mb-8">
          Privacy Policy
        </h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            At FitCheck AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
          </p>

          <h2 className="text-2xl font-bold font-poppins mt-8 mb-4">Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We collect information that you provide directly to us, including when you create an account, use our virtual try-on feature, or contact us for support.
          </p>

          <h2 className="text-2xl font-bold font-poppins mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We use the information we collect to provide, maintain, and improve our services, process your transactions, and communicate with you.
          </p>

          <h2 className="text-2xl font-bold font-poppins mt-8 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{' '}
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
