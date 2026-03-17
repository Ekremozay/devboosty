'use client';
// src/hooks/useFavorites.ts
import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

const FAVORITES_KEY = 'devboosty_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(FAVORITES_KEY, []);

  const isFavorite = useCallback((slug: string) => favorites.includes(slug), [favorites]);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  }, [setFavorites]);

  return { favorites, isFavorite, toggleFavorite };
}
