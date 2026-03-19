// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import AppShell from '@/components/layout/AppShell';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { DEFAULT_LOCALE } from '@/i18n/config';

export const metadata: Metadata = {
  title: {
    default: 'DevBoosty – All-in-One Developer Tools Platform',
    template: '%s | DevBoosty',
  },
  description: 'Modern all-in-one developer tools platform with JSON formatting, code utilities, image cleanup, markdown preview, palette generation, and multi-tool workspaces.',
  keywords: ['developer tools platform', 'all in one developer hub', 'json formatter', 'markdown previewer', 'code formatter', 'image enhancer', 'palette generator'],
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
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen">
        <LocaleProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
