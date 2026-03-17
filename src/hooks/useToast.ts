'use client';
// src/hooks/useToast.ts
import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let globalAddToast: ((message: string, type?: ToastType) => void) | null = null;

export function registerToast(fn: (message: string, type?: ToastType) => void) {
  globalAddToast = fn;
}

export function toast(message: string, type: ToastType = 'success') {
  globalAddToast?.(message, type);
}

export function useToastState() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${++counterRef.current}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
