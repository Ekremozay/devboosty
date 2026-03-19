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
      <div className="space-y-4 pb-24 sm:space-y-6">
        {/* Breadcrumb - scrollable on mobile */}
        <nav className="flex items-center gap-2 overflow-x-auto text-xs text-slate-400 dark:text-slate-500 sm:text-sm" aria-label="Breadcrumb">
          <Link href="/" className="flex-shrink-0 transition-colors hover:text-slate-600 dark:hover:text-slate-300">{t('home')}</Link>
          <span className="flex-shrink-0">/</span>
          <Link href="/tools" className="flex-shrink-0 transition-colors hover:text-slate-600 dark:hover:text-slate-300">{t('tools')}</Link>
          <span className="flex-shrink-0">/</span>
          <Link href={`/tools?workspace=${tool.workspaceCategory}`} className="flex-shrink-0 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
            {workspaceInfo.name}
          </Link>
          <span className="flex-shrink-0">/</span>
          <span className="flex-shrink-0 font-medium text-slate-600 dark:text-slate-300">{tool.name}</span>
        </nav>

        {/* Hero section - stacked on mobile */}
        <section className="dashboard-panel relative overflow-hidden px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(87,80,241,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(22,184,166,0.14),transparent_26%)]" />
          <div className="relative space-y-5 xl:grid xl:grid-cols-[minmax(0,1.4fr)_300px] xl:items-start xl:gap-6 xl:space-y-0">
            <div>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${workspaceInfo.badgeClassName}`}>
                {workspaceInfo.shortName}
              </span>
              <div className="mt-4 flex items-start gap-3 sm:mt-5 sm:gap-4">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] border border-slate-200 bg-white text-2xl shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:h-16 sm:w-16 sm:rounded-[24px] sm:text-3xl">
                  {tool.icon}
                </span>
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-4xl">
                    {tool.h1}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:mt-3 sm:text-base sm:leading-7 md:max-w-3xl">{tool.description}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
                <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">{t('freeBadge')}</span>
                <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">{t('noSignup')}</span>
                <span className="dashboard-badge bg-white/85 text-slate-700 dark:bg-slate-950/80 dark:text-slate-300">{t('browserBased')}</span>
                <FavoriteButton slug={tool.slug} name={tool.name} />
              </div>
            </div>

            {/* Stats - horizontal on mobile, vertical on desktop */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 xl:grid-cols-1">
              {[
                [t('category'), workspaceInfo.name],
                [t('related'), String(related.length)],
                [t('mode'), t('clientSide')],
              ].map(([label, value]) => (
                <div key={label} className="dashboard-stat px-3 py-3 sm:px-4 sm:py-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 sm:text-xs">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white sm:mt-2 sm:text-lg">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main content + sidebar grid */}
        <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.45fr)_340px]">
          <div className="space-y-4 sm:space-y-6">
            <AdBanner slot="TOP_BANNER_SLOT" format="leaderboard" className="h-28" label={t('advertisement')} />

            {/* Tool interface panel */}
            <section className="dashboard-panel p-3 sm:p-4 md:p-6">
              <ToolLoader component={tool.component} />
            </section>

            {tool.faq && tool.faq.length > 0 && <FAQSection faqs={tool.faq} />}

            <section className="dashboard-panel px-4 py-4 sm:px-5 sm:py-5 md:px-6">
              <span className="dashboard-badge">{t('aboutBadge')}</span>
              <h2 className="mt-3 font-display text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">{t('whyTitle', { name: tool.name })}</h2>
              <div className="prose-blog mt-4">
                <p>{tool.description}</p>
                <p>{t('whyDesc')}</p>
              </div>
            </section>

            <RelatedTools tools={related} currentSlug={tool.slug} />
          </div>

          {/* Sidebar - hidden on mobile, shown on xl */}
          <aside className="hidden space-y-6 xl:block">
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
