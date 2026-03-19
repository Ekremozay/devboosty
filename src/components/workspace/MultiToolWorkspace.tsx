'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getAllTools, getToolBySlug } from '@/lib/tools-registry';
import ToolLoader from '@/app/tools/[category]/[tool]/ToolLoader';

const DEFAULT_STACK = ['data-format-converter', 'curl-fetch-converter', 'contrast-checker'];

export default function MultiToolWorkspace() {
  const t = useTranslations('workspace');
  const allTools = getAllTools();
  const [selectedTools, setSelectedTools, hydrated] = useLocalStorage<string[]>('devboosty_workspace_panels', DEFAULT_STACK);
  const stack = selectedTools.length === 3 ? selectedTools : DEFAULT_STACK;

  const STACK_PRESETS = [
    { labelKey: 'presetApiLab', tools: ['data-format-converter', 'query-params-parser', 'curl-fetch-converter'] },
    { labelKey: 'presetUiStudio', tools: ['contrast-checker', 'css-gradient-generator', 'svg-optimizer'] },
    { labelKey: 'presetDocsFlow', tools: ['markdown-previewer', 'text-diff', 'code-formatter'] },
    { labelKey: 'presetAiStudio', tools: ['ai-chat-workbench', 'speech-to-text', 'text-to-speech'] },
  ];

  const updateTool = (index: number, slug: string) => {
    const next = [...stack];
    next[index] = slug;
    setSelectedTools(next);
  };

  const applyPreset = (tools: string[]) => setSelectedTools(tools);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 dark:from-brand-700 dark:via-brand-800 dark:to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.15),transparent_60%)]" />

        <div className="relative px-8 py-12 sm:px-12 sm:py-14">
          <span className="inline-block rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            {t('badge')}
          </span>

          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
            {t('description')}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-white" />
              {t('livePanels')}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {hydrated ? t('savedLocally') : t('loading')}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              {t('browserBased')}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-white/50">{t('quickStacks')}</span>
            {STACK_PRESETS.map((preset) => (
              <button
                key={preset.labelKey}
                type="button"
                onClick={() => applyPreset(preset.tools)}
                className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/25 backdrop-blur-sm"
              >
                {t(preset.labelKey as 'presetApiLab' | 'presetUiStudio' | 'presetDocsFlow' | 'presetAiStudio')}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {stack.map((slug, index) => {
          const tool = getToolBySlug(slug) ?? getToolBySlug(DEFAULT_STACK[index]);
          if (!tool) return null;

          return (
            <section key={`${tool.slug}-${index}`} className={`dashboard-panel flex flex-col px-4 py-4 sm:px-5 sm:py-5${index === 2 ? ' md:col-span-2' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{t('panel')} {index + 1}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{tool.name}</p>
                </div>
                <Link href={`/tools/${tool.category}/${tool.slug}`} className="btn-ghost rounded-[18px] border border-slate-200 px-3 py-2 text-xs dark:border-slate-800">
                  {t('openDetail')}
                </Link>
              </div>

              <select
                value={tool.slug}
                onChange={(event) => updateTool(index, event.target.value)}
                className="mt-4 rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {allTools.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>

              <div className="mt-4 min-h-[520px] rounded-[24px] border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <ToolLoader component={tool.component} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
