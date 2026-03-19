'use client';
// src/hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}"`, error);
    }
    setHydrated(true);
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      try {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      } catch (error) {
        console.warn(`useLocalStorage: error setting key "${key}"`, error);
        return prev;
      }
    });
  }, [key]);

  return [storedValue, setValue, hydrated] as const;
}
