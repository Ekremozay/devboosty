'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { WORKSPACE_CATEGORIES, getAllTools } from '@/lib/tools-registry';
import type { WorkspaceCategory } from '@/lib/tools-registry';

export default function Footer() {
  const t = useTranslations();
  const popularTools = getAllTools().filter((tool) => tool.popular).slice(0, 4);
  const categoryList = (Object.keys(WORKSPACE_CATEGORIES) as WorkspaceCategory[]).slice(0, 5);

  return (
    <footer className="dashboard-panel px-5 py-6 sm:px-6">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[22px] bg-gradient-to-br from-brand-500 via-brand-600 to-sky-500 text-sm font-black text-white shadow-lg shadow-brand-500/20">
              DB
            </span>
            <div>
              <p className="font-display text-xl font-bold text-slate-950 dark:text-white">DevBoosty</p>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                All-in-one developer hub
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">{t('footer.tagline')}</p>
        </div>

        <div className="grid flex-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Workspace</p>
            <div className="mt-3 space-y-3">
              {[
                { href: '/', label: 'Overview' },
                { href: '/tools', label: t('nav.allTools') },
                { href: '/workspace', label: 'Workspace' },
                { href: '/favorites', label: t('nav.favorites') },
                { href: '/blog', label: t('nav.blog') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('footer.categories')}</p>
            <div className="mt-3 space-y-3">
              {categoryList.map((category) => (
                <Link
                  key={category}
                  href={`/tools?workspace=${category}`}
                  className="block text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  {WORKSPACE_CATEGORIES[category].name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('footer.popularTools')}</p>
            <div className="mt-3 space-y-3">
              {popularTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.category}/${tool.slug}`}
                  className="block text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/80 pt-5 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <p>{t('footer.noSignup')}</p>
      </div>
    </footer>
  );
}
