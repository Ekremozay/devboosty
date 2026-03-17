'use client';
// src/components/ui/RecentToolTracker.tsx
// Invisible component that records the current tool slug into recentTools on mount.
import { useEffect } from 'react';
import { useRecentTools } from '@/hooks/useRecentTools';

export default function RecentToolTracker({ slug }: { slug: string }) {
  const { addRecent } = useRecentTools();
  useEffect(() => {
    addRecent(slug);
  }, [slug, addRecent]);
  return null;
}
