'use client';
// src/components/layout/AppShell.tsx
// Client wrapper that holds global UI features: search modal, toast notifications.

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchModal from '@/components/ui/SearchModal';
import ToastContainer from '@/components/ui/Toast';
import { useState, useEffect, useCallback } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Cmd+K / Ctrl+K to open search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Header onSearchClick={openSearch} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <SearchModal open={searchOpen} onClose={closeSearch} />
      <ToastContainer />
    </>
  );
}
