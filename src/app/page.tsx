'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AdBanner } from '@/components/layout/AdBanner';
import ToolCard from '@/components/ui/ToolCard';
import { WORKSPACE_CATEGORIES, getAllTools, getNewTools, getPopularTools, getToolBySlug, type WorkspaceCategory } from '@/lib/tools-registry';

const BUILT_IN_ESSENTIALS = [
  'background-remover',
  'image-enhancer',
  'html-viewer',
  'json-formatter',
  'base64-encode',
  'url-encoder',
  'color-converter',
  'regex-tester',
  'markdown-previewer',
  'code-formatter',
  'ai-chat-workbench',
  'speech-to-text',
  'ai-image-generator',
];

export default function HomePage() {
  const t = useTranslations('home');
  const allTools = getAllTools();
  const popular = getPopularTools().slice(0, 8);
  const fresh = getNewTools().slice(0, 6);
  const essentials = BUILT_IN_ESSENTIALS
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean);
  const workspaceCategories = Object.keys(WORKSPACE_CATEGORIES) as WorkspaceCategory[];

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <div className="dashboard-panel relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,140,15,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(36,180,140,0.14),transparent_26%)]" />
          <div className="relative">
            <span className="dashboard-badge bg-white/85 text-brand-700 dark:bg-slate-950/80 dark:text-brand-200">
              {t('badge')}
            </span>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[3.5rem]">
              {t('title').split(',')[0]},
              {' '}
              <span className="gradient-text">{t('title').split(',').slice(1).join(',').trim()}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">
              {t('description')}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/tools" className="btn-primary px-6 py-3.5 text-base">
                {t('browseAll')}
              </Link>
              <Link href="/workspace" className="btn-secondary px-6 py-3.5 text-base">
                {t('openWorkspace')}
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [`${allTools.length}+`, t('statsTools')],
                [`${workspaceCategories.length}`, t('statsCategories')],
                ['Auto', t('statsTheme')],
                ['0', t('statsSignup')],
              ].map(([value, label]) => (
                <div key={label} className="dashboard-stat px-4 py-4">
                  <p className="font-display text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="dashboard-panel px-5 py-5">
            <span className="dashboard-badge">{t('whatShips')}</span>
            <div className="mt-5 space-y-4">
              {[
                [t('featureSearchTitle'), t('featureSearchDesc')],
                [t('featureWorkspaceTitle'), t('featureWorkspaceDesc')],
                [t('featureAiTitle'), t('featureAiDesc')],
                [t('featureBrowserTitle'), t('featureBrowserDesc')],
              ].map(([title, description]) => (
                <div key={title} className="rounded-[22px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <AdBanner slot="HOME_TOP_SLOT" format="rectangle" className="h-72" />
        </div>
      </section>

      <section className="dashboard-panel px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="dashboard-badge">{t('coreEssentials')}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{t('coreTitle')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('coreDesc')}</p>
          </div>
          <Link href="/tools" className="btn-ghost self-start sm:self-auto">
            {t('viewFullLibrary')}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {essentials.map((tool, index) => (
            <ToolCard key={tool!.slug} tool={tool!} index={index} />
          ))}
        </div>
      </section>

      <section className="dashboard-panel px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="dashboard-badge">{t('trendingBadge')}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{t('trendingTitle')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('trendingDesc')}</p>
          </div>
          <Link href="/tools?mode=popular" className="btn-ghost self-start sm:self-auto">
            {t('seeAllPopular')}
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {popular.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} index={index} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="dashboard-panel px-5 py-5 sm:px-6">
          <span className="dashboard-badge">{t('categoriesBadge')}</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{t('categoriesTitle')}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('categoriesDesc')}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {workspaceCategories.map((category) => {
              const info = WORKSPACE_CATEGORIES[category];
              const count = allTools.filter((tool) => tool.workspaceCategory === category).length;

              return (
                <Link
                  key={category}
                  href={`/tools?workspace=${category}`}
                  className="group rounded-[26px] border border-slate-200 bg-white/80 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_56px_-30px_rgba(18,32,49,0.32)] dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br ${info.color} text-xl text-white shadow-lg`}>
                      {info.icon}
                    </span>
                    <span className="dashboard-badge bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300">{count} {t('tools')}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-slate-950 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                    {info.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{info.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="dashboard-panel px-5 py-5">
            <span className="dashboard-badge">{t('workspaceModeBadge')}</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-slate-950 dark:text-white">{t('combineTitle')}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('combineDesc')}
            </p>
            <div className="mt-5 space-y-3">
              {[t('combineBullet1'), t('combineBullet2'), t('combineBullet3')].map((item) => (
                <div key={item} className="rounded-[20px] border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                  {item}
                </div>
              ))}
            </div>
            <Link href="/workspace" className="btn-primary mt-6">
              {t('launchWorkspace')}
            </Link>
          </div>

          <AdBanner slot="HOME_MID_SLOT" format="leaderboard" className="h-28" />
        </div>
      </section>

      {fresh.length > 0 && (
        <section className="dashboard-panel px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="dashboard-badge">{t('newAdditionsBadge')}</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-slate-950 dark:text-white">{t('freshTools')}</h2>
            </div>
            <Link href="/tools?mode=new" className="btn-ghost self-start sm:self-auto">
              {t('exploreNew')}
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fresh.map((tool, index) => (
              <ToolCard key={tool.slug} tool={tool} index={index} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
