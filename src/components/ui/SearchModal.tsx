'use client';
// src/components/ui/SearchModal.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { getAllTools } from '@/lib/tools-registry';
import type { Tool } from '@/lib/tools-registry';
import Link from 'next/link';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  developer: 'Developer',
  text: 'Text',
  seo: 'SEO',
  image: 'Image',
  pdf: 'PDF',
  converter: 'Converter',
};

function highlight(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded px-0.5">$1</mark>');
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const allTools = getAllTools();

  const results: Tool[] = query.trim()
    ? allTools.filter(t => {
        const q = query.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.keywords.some(k => k.toLowerCase().includes(q))
        );
      }).slice(0, 12)
    : allTools.filter(t => t.popular).slice(0, 8);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      const tool = results[activeIdx];
      if (tool) {
        window.location.href = `/tools/${tool.category}/${tool.slug}`;
        onClose();
      }
    }
  }, [results, activeIdx, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700">
          <svg className="text-slate-400 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={handleKey}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-sm font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg leading-none">×</button>
          )}
          <kbd className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded font-mono">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
              No tools found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <div className="px-4 pt-2.5 pb-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                  {query ? `${results.length} results` : 'Popular tools'}
                </span>
              </div>
              <ul>
                {results.map((tool, i) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.category}/${tool.slug}`}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${i === activeIdx ? 'bg-brand-50 dark:bg-brand-950' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                      onMouseEnter={() => setActiveIdx(i)}
                    >
                      <span className="text-xl w-7 text-center flex-shrink-0">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm font-medium text-slate-800 dark:text-slate-100"
                          dangerouslySetInnerHTML={{ __html: highlight(tool.name, query) }}
                        />
                        <div
                          className="text-xs text-slate-500 dark:text-slate-400 truncate"
                          dangerouslySetInnerHTML={{ __html: highlight(tool.tagline, query) }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                        {CATEGORY_LABELS[tool.category] ?? tool.category}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
