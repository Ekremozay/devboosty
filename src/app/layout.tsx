// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'ToolHub – Free Online Developer, SEO & Productivity Tools',
    template: '%s | ToolHub',
  },
  description: 'Free online tools for developers, SEO professionals, and content creators. JSON formatter, image compressor, PDF merger, word counter, and 100+ more tools.',
  keywords: ['online tools', 'free tools', 'developer tools', 'seo tools', 'text tools', 'image tools', 'pdf tools'],
  authors: [{ name: 'ToolHub' }],
  creator: 'ToolHub',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://toolhub.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ToolHub',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@toolhub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Ads — replace CA-PUB-XXXXXXXXXX with your publisher ID */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
