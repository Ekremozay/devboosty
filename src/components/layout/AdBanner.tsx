'use client';
// src/components/layout/AdBanner.tsx
// Replace data-ad-client and data-ad-slot with your real values from Google AdSense

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'leaderboard' | 'mobile-banner';
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ slot, format = 'auto', className = '', label = 'Advertisement' }: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [adsenseId]);

  // Dev mode: show placeholder
  if (!adsenseId) {
    const heights: Record<string, string> = {
      auto: 'h-24',
      rectangle: 'h-64',
      leaderboard: 'h-24',
      'mobile-banner': 'h-14',
    };
    return (
      <div className={`ad-placeholder ${heights[format]} ${className}`}>
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">{label}</div>
          <div className="text-xs text-slate-300">Google AdSense · {format}</div>
          <div className="text-xs text-slate-400 mt-1">Set NEXT_PUBLIC_ADSENSE_ID to enable</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Sticky mobile ad — fixed to bottom of screen
export function StickyMobileAd() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense sticky error:', err);
    }
  }, [adsenseId]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-slate-200 shadow-lg">
      {adsenseId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', height: '60px' }}
          data-ad-client={adsenseId}
          data-ad-slot="MOBILE_STICKY_SLOT"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="ad-placeholder h-14 mx-4 my-1">
          <span className="text-xs text-slate-300">Mobile Sticky Ad</span>
        </div>
      )}
    </div>
  );
}
