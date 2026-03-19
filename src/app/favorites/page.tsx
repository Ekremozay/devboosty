'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ToolCard from '@/components/ui/ToolCard';
import { useFavorites } from '@/hooks/useFavorites';
import { getToolBySlug } from '@/lib/tools-registry';

export default function FavoritesPage() {
  const t = useTranslations('favoritesPage');
  const { favorites } = useFavorites();
  const tools = favorites
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[];

  return (
    <div className="space-y-6">
      <section className="dashboard-panel px-6 py-6 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_320px]">
          <div>
            <span className="dashboard-badge">{t('badge')}</span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-400">
              {t('description')}
            </p>
          </div>

          <div className="dashboard-panel-muted px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('status')}</p>
            <div className="mt-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <p className="font-display text-4xl font-bold text-slate-950 dark:text-white">{tools.length}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {t('savedTools')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {tools.length > 0 ? (
        <section className="dashboard-panel px-5 py-5 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool, index) => (
              <ToolCard key={tool.slug} tool={tool} index={index} />
            ))}
          </div>
        </section>
      ) : (
        <section className="dashboard-panel px-6 py-10 text-center sm:px-8">
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] border border-slate-200 bg-white text-4xl shadow-sm dark:border-slate-700 dark:bg-slate-950">
              ☆
            </div>
            <h2 className="mt-6 font-display text-3xl font-bold text-slate-950 dark:text-white">{t('emptyTitle')}</h2>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
              {t('emptyDesc')}
            </p>
            <Link href="/tools" className="btn-primary mt-6">
              {t('browseAll')}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
