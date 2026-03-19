'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AdBanner } from '@/components/layout/AdBanner';
import ToolCard from '@/components/ui/ToolCard';
import type { Tool } from '@/lib/tools-registry';

interface CategoryInfo {
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface CategoryPageContentProps {
  category: CategoryInfo;
  categorySlug: string;
  tools: Tool[];
}

export default function CategoryPageContent({ category, categorySlug, tools }: CategoryPageContentProps) {
  const t = useTranslations('categoryPage');
  const tp = useTranslations('ui');
  const popularCount = tools.filter((tool) => tool.popular).length;
  const newCount = tools.filter((tool) => tool.new).length;

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400 dark:text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">{t('home')}</Link>
        <span>/</span>
        <Link href="/tools" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">{t('tools')}</Link>
        <span>/</span>
        <span className="font-medium text-slate-600 dark:text-slate-300">{category.name}</span>
      </nav>

      <section className="dashboard-panel relative overflow-hidden px-6 py-6 sm:px-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-[0.12]`} />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_300px] xl:items-start">
          <div>
            <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">{t('badge')}</span>
            <div className="mt-5 flex items-start gap-4">
              <span className={`flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br ${category.color} text-3xl text-white shadow-lg`}>
                {category.icon}
              </span>
              <div>
                <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">{category.name}</h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-400">{category.description}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="dashboard-stat px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{t('tools')}</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{tools.length}</p>
            </div>
            <div className="dashboard-stat px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{tp('popular')}</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{popularCount}</p>
            </div>
            <div className="dashboard-stat px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{tp('new')}</p>
              <p className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{newCount}</p>
            </div>
          </div>
        </div>
      </section>

      <AdBanner slot="CATEGORY_TOP_SLOT" format="leaderboard" className="h-28" />

      <section className="dashboard-panel px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="dashboard-badge">{t('badge')}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{category.name}</h2>
          </div>
          <Link href="/tools" className="btn-ghost self-start sm:self-auto">
            {t('back')}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} />
          ))}
        </div>
      </section>

      <AdBanner slot="CATEGORY_BOTTOM_SLOT" format="leaderboard" className="h-28" />
    </div>
  );
}
