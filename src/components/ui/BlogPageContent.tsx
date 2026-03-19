'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/lib/tools-registry';
import type { BlogPost } from '@/lib/blog-registry';

const CATEGORY_COLORS: Record<string, string> = {
  developer: 'chip-developer',
  seo: 'chip-seo',
  image: 'chip-image',
  pdf: 'chip-pdf',
  text: 'chip-text',
};

interface BlogPageContentProps {
  posts: BlogPost[];
}

export default function BlogPageContent({ posts }: BlogPageContentProps) {
  const t = useTranslations('blogPage');

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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('coverage')}</p>
            <div className="mt-4 space-y-3">
              {Object.entries(CATEGORIES).slice(0, 4).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-white/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{value.name}</span>
                  <span className="text-sm">{value.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-panel px-5 py-5 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="tool-card group flex h-full flex-col gap-4 p-5 animate-fade-in transition-all duration-200 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
            >
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${CATEGORY_COLORS[post.category] || 'chip-developer'}`}>
                  {post.category}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{post.readingTime} {t('minRead')}</span>
              </div>

              <h2 className="font-display text-2xl font-bold leading-tight text-slate-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                {post.title}
              </h2>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{post.excerpt}</p>

              <div className="mt-auto flex items-center justify-between border-t border-slate-200/80 pt-4 text-sm dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500">
                  {new Date(post.publishDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="font-semibold text-brand-600 dark:text-brand-300">{t('readArticle')}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
