'use client';

import Link from 'next/link';
import { useState } from 'react';
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
  const t = useTranslations();
  const th = useTranslations('header');
  const { locale, changeLocale } = useLocaleContext();
  const currentLocale = locale || DEFAULT_LOCALE;
  const locales: Locale[] = ['en', 'tr', 'ar', 'de'];
  const context = getDashboardContext(pathname);

  return (
    <header className="sticky top-0 z-30 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="dashboard-panel px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-4 xl:flex-nowrap xl:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onMenuClick}
                    className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-slate-200 bg-white text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-200 xl:hidden"
                  aria-label={th('openNav')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </svg>
                </button>

                <Link href="/" className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-sm font-black text-brand-950 shadow-lg shadow-brand-500/20">
                    DB
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold text-slate-950 dark:text-white">DevBoosty</span>
                    <span className="block text-xs font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                      {th('tagline')}
                    </span>
                  </span>
                </Link>
              </div>

              <nav className="hidden flex-1 justify-center xl:flex">
                <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 dark:border-slate-800 dark:bg-slate-950/60">
                  {WORKSPACE_LINKS.map((link) => {
                    const active = isActivePath(pathname, link.href, link.match);

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
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={onSearchClick}
                  className="dashboard-input flex min-w-[220px] items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-800 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-200"
                  aria-label={t('search.placeholder')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <span className="flex-1 truncate">{t('search.placeholder')}</span>
                  <kbd className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-500">
                    ⌘K
                  </kbd>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setLangOpen((value) => !value)}
                    className="flex h-11 items-center gap-2 rounded-[18px] border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-200"
                    aria-label={t('language.select')}
                  >
                    <span className="text-base leading-none">{LOCALE_FLAGS[currentLocale]}</span>
                    <span>{currentLocale.toUpperCase()}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {langOpen && (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-10 cursor-default"
                        onClick={() => setLangOpen(false)}
                        aria-label={th('closeLang')}
                      />
                      <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-52 overflow-hidden rounded-[24px] border border-slate-200 bg-[#fffaf4] p-2 shadow-2xl dark:border-slate-700 dark:bg-[#241b14]">
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
                              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm transition-colors ${
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

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
              <div className="min-w-0">
                <span className="dashboard-badge">{context.eyebrow}</span>
                <p className="mt-2 font-display text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-[1.55rem]">
                  {context.title}
                </p>
                <p className="mt-1 max-w-3xl text-[13px] leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                  {context.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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
    </header>
  );
}
