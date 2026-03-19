'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WORKSPACE_CATEGORIES, getAllTools } from '@/lib/tools-registry';
import type { Tool } from '@/lib/tools-registry';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

function highlight(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="rounded-md bg-brand-50 px-1 py-0.5 text-brand-700 dark:bg-brand-500/12 dark:text-brand-200">$1</mark>',
  );
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const allTools = getAllTools();
  const t = useTranslations();

  const results: Tool[] = query.trim()
    ? allTools
        .filter((tool) => {
          const normalized = query.toLowerCase();
          return (
            tool.name.toLowerCase().includes(normalized) ||
            tool.description.toLowerCase().includes(normalized) ||
            tool.category.toLowerCase().includes(normalized) ||
            tool.workspaceCategory.toLowerCase().includes(normalized) ||
            WORKSPACE_CATEGORIES[tool.workspaceCategory].name.toLowerCase().includes(normalized) ||
            tool.keywords.some((keyword) => keyword.toLowerCase().includes(normalized))
          );
        })
        .slice(0, 12)
    : allTools.filter((tool) => tool.popular).slice(0, 8);

  useEffect(() => {
    if (!open) return;

    setQuery('');
    setActiveIdx(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  const handleKey = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIdx((index) => Math.min(index + 1, results.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIdx((index) => Math.max(index - 1, 0));
      } else if (event.key === 'Enter') {
        const tool = results[activeIdx];
        if (tool) {
          window.location.href = `/tools/${tool.category}/${tool.slug}`;
          onClose();
        }
      }
    },
    [results, activeIdx, onClose],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center px-4 pt-[10vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-[rgba(73,46,22,0.34)] backdrop-blur-md dark:bg-[rgba(15,8,4,0.6)]" />

      <div
        className="dashboard-panel relative w-full max-w-3xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-200/80 px-4 py-4 dark:border-slate-800">
          <div className="dashboard-input flex items-center gap-3 px-4 py-3.5">
            <svg className="flex-shrink-0 text-slate-400 dark:text-slate-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIdx(0);
              }}
              onKeyDown={handleKey}
              placeholder={t('search.placeholder')}
              className="flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-brand-500/12 dark:hover:text-brand-200"
              >
                ×
              </button>
            )}
            <kbd className="rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-500">
              Esc
            </kbd>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto px-2 py-2">
          {results.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
              {t('search.noResults', { query })}
            </div>
          ) : (
            <>
              <div className="px-4 pb-2 pt-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                  {query ? t('search.results', { count: results.length }) : t('search.popular')}
                </span>
              </div>
              <ul className="space-y-1">
                {results.map((tool, index) => {
                  const active = index === activeIdx;

                  return (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.category}/${tool.slug}`}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIdx(index)}
                        className={`flex items-center gap-3 rounded-[22px] border px-4 py-3 transition-colors ${
                          active
                            ? 'border-brand-200 bg-brand-50 dark:border-brand-500/35 dark:bg-brand-500/12'
                            : 'border-transparent hover:border-slate-300 hover:bg-white/80 dark:hover:border-slate-800 dark:hover:bg-slate-900/40'
                        }`}
                      >
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg dark:border-slate-700 dark:bg-slate-950/70">
                          {tool.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div
                            className="truncate text-sm font-semibold text-slate-900 dark:text-white"
                            dangerouslySetInnerHTML={{ __html: highlight(tool.name, query) }}
                          />
                          <div
                            className="truncate text-xs text-slate-500 dark:text-slate-400"
                            dangerouslySetInnerHTML={{ __html: highlight(tool.tagline, query) }}
                          />
                        </div>
                        <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 sm:block">
                          {WORKSPACE_CATEGORIES[tool.workspaceCategory].shortName}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-200/80 px-5 py-3 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <span>
            <kbd className="font-mono">↑↓</kbd> {t('search.navigate')}
          </span>
          <span>
            <kbd className="font-mono">↵</kbd> {t('search.open')}
          </span>
          <span>
            <kbd className="font-mono">Esc</kbd> {t('search.close')}
          </span>
        </div>
      </div>
    </div>
  );
}
