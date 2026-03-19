'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getPopularTools } from '@/lib/tools-registry';

export default function NotFound() {
  const t = useTranslations('notFound');
  const popular = getPopularTools().slice(0, 4);

  return (
    <div className="space-y-6">
      <section className="dashboard-panel px-6 py-10 text-center sm:px-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <span className="dashboard-badge">{t('badge')}</span>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400">
            {t('description')}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary">
              {t('backHome')}
            </Link>
            <Link href="/tools" className="btn-secondary">
              {t('browseTools')}
            </Link>
          </div>
        </div>
      </section>

      <section className="dashboard-panel px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="dashboard-badge">{t('popularRoutes')}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{t('jumpBack')}</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {popular.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.category}/${tool.slug}`}
              className="tool-card flex items-center gap-4 p-4 transition-all duration-200 hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-[20px] border border-slate-200 bg-white text-xl dark:border-slate-700 dark:bg-slate-950">
                {tool.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">{tool.name}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{tool.tagline}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
