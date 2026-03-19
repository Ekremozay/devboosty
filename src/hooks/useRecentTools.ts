'use client';
// src/hooks/useRecentTools.ts
import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

const RECENT_KEY = 'devboosty_recent';
const MAX_RECENT = 10;

export function useRecentTools() {
  const [recents, setRecents] = useLocalStorage<string[]>(RECENT_KEY, []);

  const addRecent = useCallback((slug: string) => {
    setRecents(prev => {
      if (prev[0] === slug) return prev;
      const filtered = prev.filter(s => s !== slug);
      return [slug, ...filtered].slice(0, MAX_RECENT);
    });
  }, [setRecents]);

  return { recents, addRecent };
}
