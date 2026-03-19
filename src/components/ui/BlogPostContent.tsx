'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AdBanner } from '@/components/layout/AdBanner';
import type { BlogPost } from '@/lib/blog-registry';
import type { Tool } from '@/lib/tools-registry';

interface BlogPostContentProps {
  post: BlogPost;
  relatedTool: Tool | null;
}

export default function BlogPostContent({ post, relatedTool }: BlogPostContentProps) {
  const t = useTranslations('blogPage');

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400 dark:text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">{t('home')}</Link>
        <span>/</span>
        <Link href="/blog" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">{t('badge')}</Link>
        <span>/</span>
        <span className="font-medium text-slate-600 dark:text-slate-300">{post.title}</span>
      </nav>

      <section className="dashboard-panel relative overflow-hidden px-6 py-6 sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(87,80,241,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(22,184,166,0.12),transparent_24%)]" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] chip-${post.category}`}>
              {post.category}
            </span>
            <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">{post.readingTime} {t('minRead')}</span>
            <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">
              {new Date(post.publishDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-400">{post.excerpt}</p>
        </div>
      </section>

      {relatedTool && (
        <section className="dashboard-panel px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="dashboard-badge">{t('tryTool')}</span>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{relatedTool.name}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{relatedTool.tagline}</p>
            </div>
            <Link href={`/tools/${relatedTool.category}/${relatedTool.slug}`} className="btn-primary self-start sm:self-auto">
              {relatedTool.icon} {t('openTool')}
            </Link>
          </div>
        </section>
      )}

      <AdBanner slot="BLOG_TOP_SLOT" format="leaderboard" className="h-28" />

      <article className="dashboard-panel px-6 py-6 sm:px-8">
        <div className="prose-blog">
          {post.content.map((section, index) => {
            switch (section.type) {
              case 'h2':
                return <h2 key={index}>{section.content as string}</h2>;
              case 'h3':
                return <h3 key={index}>{section.content as string}</h3>;
              case 'p':
                return <p key={index}>{section.content as string}</p>;
              case 'ul':
                return <ul key={index}>{(section.content as string[]).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul>;
              case 'ol':
                return <ol key={index}>{(section.content as string[]).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ol>;
              case 'code':
                return (
                  <pre key={index}>
                    <code>{section.content as string}</code>
                  </pre>
                );
              default:
                return null;
            }
          })}
        </div>
      </article>

      <AdBanner slot="BLOG_BOTTOM_SLOT" format="leaderboard" className="h-28" />

      <div className="flex justify-start">
        <Link href="/blog" className="btn-secondary">
          {t('backToBlog')}
        </Link>
      </div>
    </div>
  );
}
