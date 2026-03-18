'use client';
// src/components/layout/Header.tsx
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useLocaleContext, type Locale } from '@/contexts/LocaleContext';

const NAV_KEYS = [
  { key: 'allTools', href: '/tools' },
  { key: 'developer', href: '/tools/developer' },
  { key: 'text', href: '/tools/text' },
  { key: 'seo', href: '/tools/seo' },
  { key: 'image', href: '/tools/image' },
  { key: 'pdf', href: '/tools/pdf' },
  { key: 'favorites', href: '/favorites' },
  { key: 'blog', href: '/blog' },
] as const;

const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  tr: '🇹🇷',
  ar: '🇸🇦',
  de: '🇩🇪',
};

interface HeaderProps {
  onSearchClick?: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const t = useTranslations();
  const { locale, changeLocale } = useLocaleContext();

  const locales: Locale[] = ['en', 'tr', 'ar', 'de'];

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-brand-300/50 transition-shadow shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L4 9h4l-1 5 7-8H10L10 2z" fill="white"/>
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-slate-900 dark:text-white">
              Dev<span className="text-brand-600 dark:text-brand-400">Boosty</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors"
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <button
              onClick={onSearchClick}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-slate-800 transition-all"
              aria-label={t('search.placeholder')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="hidden sm:inline text-xs">{t('search.placeholder').replace('...', '')}</span>
              <kbd className="hidden sm:inline text-xs bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(v => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 bg-white dark:bg-slate-800 transition-all"
                aria-label={t('language.select')}
              >
                <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
                <span className="hidden sm:inline text-xs font-medium">{locale.toUpperCase()}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 z-20 w-44 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{t('language.select')}</span>
                    </div>
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => { changeLocale(loc); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                          locale === loc
                            ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                        dir={loc === 'ar' ? 'rtl' : 'ltr'}
                      >
                        <span className="text-base">{LOCALE_FLAGS[loc]}</span>
                        <span>{t(`language.${loc}`)}</span>
                        {locale === loc && <span className="ml-auto text-brand-500">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <ThemeToggle />

            <Link href="/tools" className="hidden sm:inline-flex btn-primary text-xs">
              {t('nav.allTools')}
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-0.5 bg-slate-700 dark:bg-slate-300 mb-1.5 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translate(2px, 6px)' : '' }} />
              <div className="w-5 h-0.5 bg-slate-700 dark:bg-slate-300 mb-1.5 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
              <div className="w-5 h-0.5 bg-slate-700 dark:bg-slate-300 transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translate(2px, -6px)' : '' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {/* Mobile search */}
            <button
              onClick={() => { setMenuOpen(false); onSearchClick?.(); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-lg hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {t('search.placeholder')}
            </button>
            {NAV_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-brand-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
            {/* Mobile language switcher */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 mt-1">
              <p className="text-xs text-slate-400 mb-2">{t('language.select')}</p>
              <div className="flex gap-2 flex-wrap">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { changeLocale(loc); setMenuOpen(false); }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      locale === loc
                        ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {LOCALE_FLAGS[loc]} {loc.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
