'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type DiffPart = {
  type: 'same' | 'added' | 'removed';
  value: string;
};

function buildDiff(left: string, right: string) {
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const rows: DiffPart[] = [];
  const max = Math.max(leftLines.length, rightLines.length);

  for (let index = 0; index < max; index += 1) {
    const leftLine = leftLines[index];
    const rightLine = rightLines[index];

    if (leftLine === rightLine) {
      rows.push({ type: 'same', value: leftLine ?? '' });
      continue;
    }

    if (leftLine !== undefined) rows.push({ type: 'removed', value: leftLine });
    if (rightLine !== undefined) rows.push({ type: 'added', value: rightLine });
  }

  return rows;
}

const JSON_LEFT = `{
  "name": "DevBoosty",
  "theme": "light",
  "tools": 44
}`;

const JSON_RIGHT = `{
  "name": "DevBoosty",
  "theme": "auto",
  "tools": 54,
  "workspace": true
}`;

const TEXT_LEFT = `DevBoosty is a browser-based tool platform.
It keeps common tasks in one dashboard.
Teams move faster with shared utilities.`;

const TEXT_RIGHT = `DevBoosty is an all-in-one developer tools platform.
It keeps common workflows in one dashboard.
Teams move faster with shared utilities and multi-tool workspaces.`;

function normalizeJson(value: string) {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export default function DiffChecker() {
  const pathname = usePathname();
  const isJsonMode = pathname?.includes('json-diff');
  const [left, setLeft] = useState(isJsonMode ? JSON_LEFT : TEXT_LEFT);
  const [right, setRight] = useState(isJsonMode ? JSON_RIGHT : TEXT_RIGHT);

  const { preview, error } = useMemo(() => {
    if (isJsonMode) {
      try {
        return {
          preview: buildDiff(normalizeJson(left), normalizeJson(right)),
          error: '',
        };
      } catch (diffError) {
        return {
          preview: [],
          error: diffError instanceof Error ? diffError.message : 'Invalid JSON',
        };
      }
    }

    return {
      preview: buildDiff(left, right),
      error: '',
    };
  }, [isJsonMode, left, right]);

  const summary = useMemo(() => ({
    added: preview.filter((item) => item.type === 'added').length,
    removed: preview.filter((item) => item.type === 'removed').length,
    same: preview.filter((item) => item.type === 'same').length,
  }), [preview]);

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-slate-200 bg-white/70 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
        {isJsonMode ? 'Compare two JSON documents after normalizing formatting.' : 'Compare two text blocks line by line and quickly spot changes.'}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Left side</p>
          <textarea
            value={left}
            onChange={(event) => setLeft(event.target.value)}
            className="tool-textarea font-mono text-[13px] leading-6"
            style={{ minHeight: 280 }}
            spellCheck={false}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Right side</p>
          <textarea
            value={right}
            onChange={(event) => setRight(event.target.value)}
            className="tool-textarea font-mono text-[13px] leading-6"
            style={{ minHeight: 280 }}
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Added', summary.added, 'text-emerald-700 dark:text-emerald-300'],
          ['Removed', summary.removed, 'text-rose-700 dark:text-rose-300'],
          ['Unchanged', summary.same, 'text-slate-700 dark:text-slate-300'],
        ].map(([label, value, textClass]) => (
          <div key={label} className="rounded-[20px] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${textClass}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Diff view</p>
        <div className="mt-4 overflow-x-auto rounded-[18px] border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
          <pre className="min-h-[260px] p-4 font-mono text-[13px] leading-6">
            {preview.map((part, index) => {
              const classes =
                part.type === 'added'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300'
                  : part.type === 'removed'
                    ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-300'
                    : 'text-slate-600 dark:text-slate-300';

              const prefix = part.type === 'added' ? '+' : part.type === 'removed' ? '-' : ' ';

              return (
                <div key={`${part.type}-${index}`} className={`rounded px-2 ${classes}`}>
                  {prefix} {part.value || ' '}
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
