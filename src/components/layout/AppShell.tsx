'use client';

import { useCallback, useEffect, useState } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SearchModal from '@/components/ui/SearchModal';
import ToastContainer from '@/components/ui/Toast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((previous) => !previous);
      }

      if (event.key === 'Escape') {
        setSearchOpen(false);
        setSidebarOpen(false);
      }
    }

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="dashboard-shell">
        <DashboardSidebar open={sidebarOpen} onClose={closeSidebar} />

        <div className="flex min-h-screen flex-col">
          <Header onSearchClick={openSearch} onMenuClick={openSidebar} />

          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
          </main>

          <div className="px-4 pb-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-screen-2xl">
              <Footer />
            </div>
          </div>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={closeSearch} />
      <ToastContainer />
    </>
  );
}
