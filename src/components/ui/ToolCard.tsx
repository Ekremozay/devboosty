'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { WORKSPACE_CATEGORIES, type Tool } from '@/lib/tools-registry';

export default function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const workspaceCategory = WORKSPACE_CATEGORIES[tool.workspaceCategory];
  const t = useTranslations('ui');

  return (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      className="tool-card group flex h-full flex-col gap-4 p-5 animate-fade-in transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_28px_56px_-30px_rgba(140,78,3,0.24)] dark:hover:border-brand-500/25"
      style={{ animationDelay: `${index * 0.04}s`, opacity: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-[20px] border border-slate-200 bg-white text-xl shadow-sm dark:border-slate-700 dark:bg-slate-950/70">
          {tool.icon}
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {tool.popular && (
            <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
              {t('popular')}
            </span>
          )}
          {tool.new && (
            <span className="rounded-full border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
              {t('new')}
            </span>
          )}
        </div>
      </div>

      <div className="min-h-[88px]">
        <h3 className="font-display text-lg font-bold leading-tight text-slate-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
          {tool.name}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{tool.tagline}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4 dark:border-slate-800">
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${workspaceCategory.badgeClassName}`}>
          {workspaceCategory.shortName}
        </span>
        <span className="text-sm font-semibold text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600 dark:text-slate-500 dark:group-hover:text-brand-300">
          {t('open')}
        </span>
      </div>
    </Link>
  );
}
