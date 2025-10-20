import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FitCheck AI - Your AI Fashion Assistant",
  description: "Instantly see if your outfit looks good, try clothes virtually before buying, let AI organize your wardrobe & get outfit recommendations! Effortlessly level up your style.",
  keywords: [
    "AI fashion",
    "virtual try-on",
    "outfit analysis",
    "wardrobe organizer",
    "style assistant",
    "fashion AI",
    "virtual fitting room",
    "outfit recommendations"
  ],
  icons: {
    icon: '/favicon.png',
  },
  authors: [{ name: "FitCheck AI" }],
  creator: "FitCheck AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.tryfitcheck.com",
    title: "FitCheck AI - Your AI Fashion Assistant",
    description: "Transform your style with AI-powered outfit analysis, virtual try-ons, and smart wardrobe management.",
    siteName: "FitCheck AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitCheck AI - Your AI Fashion Assistant",
    description: "Transform your style with AI-powered outfit analysis, virtual try-ons, and smart wardrobe management.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        {/* DataFast Analytics */}
        <script
          defer
          data-website-id="dfid_8dDTTY4SDh54x43CILUSu"
          data-domain="tryfitcheck.com"
          src="https://datafa.st/js/script.js"
        ></script>
      </head>
      <body className="font-inter antialiased">
        {children}
      </body>
    </html>
  );
}
