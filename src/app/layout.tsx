// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import AppShell from '@/components/layout/AppShell';
import { LocaleProvider } from '@/contexts/LocaleContext';

export const metadata: Metadata = {
  title: {
    default: 'DevBoosty – Free Online Developer Tools',
    template: '%s | DevBoosty',
  },
  description: 'Free online tools for developers and coders. JSON formatter, CSS minifier, Base64 encoder, image compressor, PDF merger, and 100+ more tools. No signup, no limits.',
  keywords: ['developer tools', 'free tools', 'online tools', 'json formatter', 'css minifier', 'base64', 'image compressor', 'pdf tools'],
  authors: [{ name: 'DevBoosty' }],
  creator: 'DevBoosty',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://devboosty.com.tr'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'DevBoosty',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@devboosty',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <LocaleProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
