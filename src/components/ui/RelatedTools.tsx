'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Tool } from '@/lib/tools-registry';

export default function RelatedTools({ tools, currentSlug }: { tools: Tool[]; currentSlug: string }) {
  const t = useTranslations('ui');
  const filtered = tools.filter(tool => tool.slug !== currentSlug).slice(0, 4);
  if (!filtered.length) return null;

  return (
    <section className="dashboard-panel mt-6 px-5 py-5 sm:px-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <span className="dashboard-badge">{t('continueWith')}</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-slate-950 dark:text-white">{t('relatedTools')}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((tool, i) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.category}/${tool.slug}`}
            className="tool-card group flex flex-col gap-3 p-4 animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl dark:border-slate-700 dark:bg-slate-950">
              {tool.icon}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors text-sm">
                {tool.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{tool.tagline}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
