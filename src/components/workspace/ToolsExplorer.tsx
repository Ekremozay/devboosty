'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolCard from '@/components/ui/ToolCard';
import { WORKSPACE_CATEGORIES, getAllTools, getNewTools, getPopularTools, type WorkspaceCategory } from '@/lib/tools-registry';

const ALL_CATEGORY = 'all';

interface ToolsExplorerProps {
  initialQuery?: string;
  initialWorkspaceCategory?: string;
  initialMode?: string;
}

export default function ToolsExplorer({
  initialQuery = '',
  initialWorkspaceCategory = '',
  initialMode = 'all',
}: ToolsExplorerProps) {
  const t = useTranslations('toolsPage');
  const allTools = getAllTools();
  const trending = getPopularTools();
  const fresh = getNewTools();
  const trendingPreview = trending.slice(0, 6);
  const freshPreview = fresh.slice(0, 6);
  const [query, setQuery] = useState(initialQuery);
  const [workspaceCategory, setWorkspaceCategory] = useState<WorkspaceCategory | typeof ALL_CATEGORY>(
    initialWorkspaceCategory && initialWorkspaceCategory in WORKSPACE_CATEGORIES
      ? initialWorkspaceCategory as WorkspaceCategory
      : ALL_CATEGORY,
  );
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | 'new'>(
    initialMode === 'popular' || initialMode === 'new' ? initialMode : 'all',
  );

  useEffect(() => {
    setQuery(initialQuery);
    setWorkspaceCategory(
      initialWorkspaceCategory && initialWorkspaceCategory in WORKSPACE_CATEGORIES
        ? initialWorkspaceCategory as WorkspaceCategory
        : ALL_CATEGORY,
    );
    setFilterMode(initialMode === 'popular' || initialMode === 'new' ? initialMode : 'all');
  }, [initialMode, initialQuery, initialWorkspaceCategory]);

  const filteredTools = allTools
    .filter((tool) => {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return true;

      return (
        tool.name.toLowerCase().includes(normalized) ||
        tool.tagline.toLowerCase().includes(normalized) ||
        tool.description.toLowerCase().includes(normalized) ||
        tool.keywords.some((keyword) => keyword.toLowerCase().includes(normalized))
      );
    })
    .filter((tool) => workspaceCategory === ALL_CATEGORY || tool.workspaceCategory === workspaceCategory)
    .filter((tool) => {
      if (filterMode === 'popular') return !!tool.popular;
      if (filterMode === 'new') return !!tool.new;
      return true;
    })
    .sort((left, right) => {
      if (!!left.popular !== !!right.popular) return left.popular ? -1 : 1;
      if (!!left.new !== !!right.new) return left.new ? -1 : 1;
      return left.name.localeCompare(right.name);
    });

  const activeCategoryMeta = workspaceCategory !== ALL_CATEGORY ? WORKSPACE_CATEGORIES[workspaceCategory] : null;

  return (
    <div className="space-y-6">
      <section className="dashboard-panel px-6 py-6 sm:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_340px]">
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('libraryStats')}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                [t('activeTools'), String(allTools.length)],
                [t('trending'), String(trending.length)],
                [t('newAdditions'), String(fresh.length)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[20px] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-panel px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex-1">
            <label className="sr-only" htmlFor="tool-search">{t('searchLabel')}</label>
            <div className="dashboard-input flex items-center gap-3 px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-slate-500">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="tool-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                placeholder={t('searchPlaceholder')}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              ['all', t('filterAll')],
              ['popular', t('filterPopular')],
              ['new', t('filterNew')],
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilterMode(mode)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  filterMode === mode
                    ? 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setWorkspaceCategory(ALL_CATEGORY)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              workspaceCategory === ALL_CATEGORY
                ? 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200'
                : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300'
            }`}
          >
            {t('filterAllCategories')}
          </button>
          {(Object.keys(WORKSPACE_CATEGORIES) as WorkspaceCategory[]).map((category) => {
            const info = WORKSPACE_CATEGORIES[category];
            const active = workspaceCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setWorkspaceCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? info.badgeClassName
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300'
                }`}
              >
                {info.icon} {info.shortName}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="dashboard-badge bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            {filteredTools.length} {t('results')}
          </span>
          {activeCategoryMeta && (
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${activeCategoryMeta.badgeClassName}`}>
              {activeCategoryMeta.name}
            </span>
          )}
          {query && (
            <button type="button" onClick={() => setQuery('')} className="btn-ghost rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-800">
              Clear search
            </button>
          )}
        </div>
      </section>

      <section className="dashboard-panel px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="dashboard-badge">{t('trendingBadge')}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{t('trendingTitle')}</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {trendingPreview.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} />
          ))}
        </div>
      </section>

      {freshPreview.length > 0 && (
        <section className="dashboard-panel px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="dashboard-badge">{t('newBadge')}</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{t('newTitle')}</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {freshPreview.map((tool, index) => (
              <ToolCard key={tool.slug} tool={tool} index={index} />
            ))}
          </div>
        </section>
      )}

      <section className="dashboard-panel px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="dashboard-badge">{t('allToolsBadge')}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">
              {activeCategoryMeta ? activeCategoryMeta.name : t('allToolsBadge')}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {activeCategoryMeta ? activeCategoryMeta.description : t('allToolsTitle')}
            </p>
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredTools.map((tool, index) => (
              <ToolCard key={tool.slug} tool={tool} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-slate-200 bg-white/80 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950/70">
            <p className="font-display text-2xl font-bold text-slate-950 dark:text-white">{t('emptyTitle')}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t('emptyDesc')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
