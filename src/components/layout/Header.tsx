'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useLocaleContext, type Locale } from '@/contexts/LocaleContext';
import { DEFAULT_LOCALE } from '@/i18n/config';
import { LOCALE_FLAGS, WORKSPACE_LINKS, getDashboardContext, isActivePath } from '@/components/layout/navigation';

interface HeaderProps {
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({ onSearchClick, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations();
  const th = useTranslations('header');
  const tn = useTranslations('navLinks');
  const { locale, changeLocale } = useLocaleContext();
  const currentLocale = locale || DEFAULT_LOCALE;
  const locales: Locale[] = ['en', 'tr', 'ar', 'de'];
  const context = getDashboardContext(pathname);

  // Translated nav labels
  const navLabels: Record<string, string> = {
    '/': tn('overview'),
    '/tools': tn('allTools'),
    '/workspace': tn('workspace'),
    '/favorites': tn('favorites'),
    '/blog': tn('blog'),
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeLang = useCallback(() => setLangOpen(false), []);

  return (
    <header className={`sticky top-0 z-30 px-3 pt-2 sm:px-4 sm:pt-3 lg:px-8 transition-all duration-300 ${scrolled ? 'pt-1 sm:pt-1.5' : ''}`}>
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="dashboard-panel px-3 py-2.5 sm:px-5 sm:py-3">
          <div className="flex flex-col gap-2 sm:gap-3">
            {/* Top bar: logo, nav, actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Hamburger - mobile/tablet only */}
              <button
                type="button"
                onClick={onMenuClick}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-200 sm:h-11 sm:w-11 sm:rounded-[18px] xl:hidden"
                aria-label={th('openNav')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" className="sm:h-[18px] sm:w-[18px]">
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 sm:gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-xs font-black text-brand-950 shadow-lg shadow-brand-500/20 sm:h-11 sm:w-11 sm:rounded-[20px] sm:text-sm">
                  DB
                </span>
                <span className="hidden sm:block">
                  <span className="block font-display text-lg font-bold text-slate-950 dark:text-white">DevBoosty</span>
                  <span className="block text-xs font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                    {th('tagline')}
                  </span>
                </span>
                <span className="block font-display text-base font-bold text-slate-950 dark:text-white sm:hidden">
                  DevBoosty
                </span>
              </Link>

              {/* Desktop nav pills */}
              <nav className="hidden flex-1 justify-center xl:flex">
                <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 dark:border-slate-800 dark:bg-slate-950/60">
                  {WORKSPACE_LINKS.map((link) => {
                    const active = isActivePath(pathname, link.href, link.match);
                    const label = navLabels[link.href] || link.label;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-brand-50 text-brand-800 dark:bg-brand-500/10 dark:text-brand-200'
                            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* Action buttons */}
              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                {/* Search - compact on mobile, full on desktop */}
                <button
                  type="button"
                  onClick={onSearchClick}
                  className="flex h-9 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-500 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400 dark:hover:border-brand-500/30 dark:hover:text-brand-200 sm:h-11 sm:min-w-[200px] sm:gap-3 sm:rounded-[18px] sm:px-4 sm:py-2.5 sm:font-medium sm:text-slate-600 lg:min-w-[220px]"
                  aria-label={t('search.placeholder')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 sm:h-4 sm:w-4">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="hidden flex-1 truncate sm:block">{t('search.placeholder')}</span>
                  <kbd className="hidden rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-500 sm:inline-block">
                    ⌘K
                  </kbd>
                </button>

                {/* Language switcher */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLangOpen((value) => !value)}
                    className="flex h-9 items-center gap-1 rounded-2xl border border-slate-200 bg-white px-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-200 sm:h-11 sm:gap-2 sm:rounded-[18px] sm:px-3.5"
                    aria-label={t('language.select')}
                  >
                    <span className="text-base leading-none">{LOCALE_FLAGS[currentLocale]}</span>
                    <span className="hidden sm:inline">{currentLocale.toUpperCase()}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="hidden sm:block">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {langOpen && (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={closeLang}
                        aria-label={th('closeLang')}
                      />
                      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-48 overflow-hidden rounded-[24px] border border-slate-200 bg-[#fffaf4] p-2 shadow-2xl dark:border-slate-700 dark:bg-[#241b14] sm:w-52">
                        {locales.map((loc) => {
                          const active = loc === currentLocale;

                          return (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => {
                                void changeLocale(loc);
                                setLangOpen(false);
                              }}
                              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors sm:py-3 ${
                                active
                                  ? 'bg-brand-50 text-brand-800 dark:bg-brand-500/12 dark:text-brand-200'
                                  : 'text-slate-600 hover:bg-brand-50 hover:text-brand-800 dark:text-slate-300 dark:hover:bg-slate-900/40 dark:hover:text-brand-200'
                              }`}
                              dir={loc === 'ar' ? 'rtl' : 'ltr'}
                            >
                              <span className="text-base">{LOCALE_FLAGS[loc]}</span>
                              <span className="flex-1 font-medium">{t(`language.${loc}`)}</span>
                              {active && <span className="text-xs font-semibold uppercase tracking-[0.16em]">{th('active')}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <ThemeToggle />
              </div>
            </div>

            {/* Context section - hidden on mobile when scrolled, always compact on mobile */}
            <div className={`transition-all duration-300 overflow-hidden ${scrolled ? 'max-h-0 opacity-0 sm:max-h-[200px] sm:opacity-100' : 'max-h-[200px] opacity-100'}`}>
              <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
                <div className="min-w-0">
                  <span className="dashboard-badge text-[10px] sm:text-xs">{context.eyebrow}</span>
                  <p className="mt-1.5 font-display text-base font-bold tracking-tight text-slate-950 dark:text-white sm:mt-2 sm:text-xl lg:text-[1.55rem]">
                    {context.title}
                  </p>
                  <p className="mt-0.5 hidden text-[13px] leading-5 text-slate-500 dark:text-slate-400 sm:mt-1 sm:block sm:text-sm md:max-w-3xl">
                    {context.description}
                  </p>
                </div>

                <div className="hidden flex-wrap items-center gap-2 sm:flex">
                  {context.stats.map((stat) => (
                    <span key={stat} className="dashboard-badge">
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
