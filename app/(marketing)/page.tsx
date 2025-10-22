import Navigation from '@/components/landing/Navigation';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import SocialProof from '@/components/landing/SocialProof';
import BusinessSolution from '@/components/landing/BusinessSolution';
import VirtualTryOnPreview from '@/components/landing/VirtualTryOnPreview';
import Testimonials from '@/components/landing/Testimonials';
import Screenshots from '@/components/landing/Screenshots';
import AppDownload from '@/components/landing/AppDownload';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <VirtualTryOnPreview />
      <Testimonials />
      <Screenshots />
      <AppDownload />
      <BusinessSolution />
      <Footer />
    </main>
  );
}
