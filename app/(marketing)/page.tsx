import Navigation from '@/components/landing/Navigation';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Screenshots from '@/components/landing/Screenshots';
import AppDownload from '@/components/landing/AppDownload';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <Screenshots />
      <AppDownload />
      <Footer />
    </main>
  );
}
