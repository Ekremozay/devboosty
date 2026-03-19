'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AdBanner, StickyMobileAd } from '@/components/layout/AdBanner';
import FAQSection from '@/components/ui/FAQSection';
import FavoriteButton from '@/components/ui/FavoriteButton';
import RelatedTools from '@/components/ui/RelatedTools';
import ToolAIAssistant from '@/components/ui/ToolAIAssistant';
import ToolLoader from '@/app/tools/[category]/[tool]/ToolLoader';
import type { Tool } from '@/lib/tools-registry';

interface WorkspaceInfo {
  name: string;
  shortName: string;
  badgeClassName: string;
}

interface ToolPageContentProps {
  tool: Tool;
  related: Tool[];
  workspaceInfo: WorkspaceInfo;
}

export default function ToolPageContent({ tool, related, workspaceInfo }: ToolPageContentProps) {
  const t = useTranslations('toolPage');

  return (
    <>
      <div className="space-y-6 pb-24">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-400 dark:text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">{t('home')}</Link>
          <span>/</span>
          <Link href="/tools" className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">{t('tools')}</Link>
          <span>/</span>
          <Link href={`/tools?workspace=${tool.workspaceCategory}`} className="transition-colors hover:text-slate-600 dark:hover:text-slate-300">
            {workspaceInfo.name}
          </Link>
          <span>/</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">{tool.name}</span>
        </nav>

        <section className="dashboard-panel relative overflow-hidden px-6 py-6 sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(87,80,241,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(22,184,166,0.14),transparent_26%)]" />
          <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_300px] xl:items-start">
            <div>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${workspaceInfo.badgeClassName}`}>
                {workspaceInfo.shortName}
              </span>
              <div className="mt-5 flex items-start gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-slate-200 bg-white text-3xl shadow-sm dark:border-slate-700 dark:bg-slate-950">
                  {tool.icon}
                </span>
                <div className="min-w-0">
                  <h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    {tool.h1}
                  </h1>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500 dark:text-slate-400">{tool.description}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">{t('freeBadge')}</span>
                <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">{t('noSignup')}</span>
                <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">{t('browserBased')}</span>
                <FavoriteButton slug={tool.slug} name={tool.name} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                [t('category'), workspaceInfo.name],
                [t('related'), String(related.length)],
                [t('mode'), t('clientSide')],
              ].map(([label, value]) => (
                <div key={label} className="dashboard-stat px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_340px]">
          <div className="space-y-6">
            <AdBanner slot="TOP_BANNER_SLOT" format="leaderboard" className="h-28" label={t('advertisement')} />

            <section className="dashboard-panel p-4 sm:p-6">
              <ToolLoader component={tool.component} />
            </section>

            {tool.faq && tool.faq.length > 0 && <FAQSection faqs={tool.faq} />}

            <section className="dashboard-panel px-5 py-5 sm:px-6">
              <span className="dashboard-badge">{t('aboutBadge')}</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-slate-950 dark:text-white">{t('whyTitle', { name: tool.name })}</h2>
              <div className="prose-blog mt-4">
                <p>{tool.description}</p>
                <p>{t('whyDesc')}</p>
              </div>
            </section>

            <RelatedTools tools={related} currentSlug={tool.slug} />
          </div>

          <aside className="space-y-6">
            <ToolAIAssistant
              toolName={tool.name}
              description={tool.description}
              workspaceName={workspaceInfo.name}
            />

            <section className="dashboard-panel px-5 py-5">
              <span className="dashboard-badge">{t('quickFacts')}</span>
              <div className="mt-5 space-y-4">
                {[
                  [t('privacyTitle'), t('privacyDesc')],
                  [t('repeatTitle'), t('repeatDesc')],
                  [t('readyTitle'), t('readyDesc')],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-[22px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-panel px-5 py-5">
              <span className="dashboard-badge">{t('relatedRoutes')}</span>
              <div className="mt-5 space-y-3">
                <Link
                  href={`/tools?workspace=${tool.workspaceCategory}`}
                  className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:text-white"
                >
                  <span>{t('backTo', { workspace: workspaceInfo.shortName })}</span>
                  <span>{t('open')}</span>
                </Link>
                {related.slice(0, 3).map((item) => (
                  <Link
                    key={item.slug}
                    href={`/tools/${item.category}/${item.slug}`}
                    className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </span>
                    <span>{t('open')}</span>
                  </Link>
                ))}
              </div>
            </section>

            <AdBanner slot="BOTTOM_BANNER_SLOT" format="rectangle" className="h-72" label={t('advertisement')} />
          </aside>
        </div>
      </div>

      <StickyMobileAd />
    </>
  );
}
