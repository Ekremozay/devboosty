'use client';

import { useMemo, useState } from 'react';

const SAMPLE_URL = 'https://devboosty.app/tools?workspace=backend-api&mode=popular&q=json+formatter';
const SAMPLE_JSON = `{
  "workspace": "backend-api",
  "mode": "popular",
  "q": "json formatter",
  "tag": ["api", "payload"]
}`;
const SAMPLE_BASE_URL = 'https://devboosty.app/tools';

export default function QueryParamsParser() {
  const [mode, setMode] = useState<'parse' | 'build'>('parse');
  const [input, setInput] = useState(SAMPLE_URL);
  const [baseUrl, setBaseUrl] = useState(SAMPLE_BASE_URL);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (mode === 'parse') {
      try {
        const base = input.startsWith('http') ? input : `https://placeholder.dev/?${input.replace(/^\?/, '')}`;
        const url = new URL(base);
        const entries = Array.from(url.searchParams.entries());
        const json = entries.reduce<Record<string, string | string[]>>((acc, [key, value]) => {
          if (key in acc) {
            const existing = acc[key];
            acc[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
          } else {
            acc[key] = value;
          }
          return acc;
        }, {});

        return {
          base: input.startsWith('http') ? `${url.origin}${url.pathname}` : '',
          entries,
          primaryOutput: JSON.stringify(json, null, 2),
          secondaryOutput: url.searchParams.toString(),
          error: '',
        };
      } catch {
        return {
          base: '',
          entries: [],
          primaryOutput: '',
          secondaryOutput: '',
          error: 'Enter a valid URL or query string.',
        };
      }
    }

    try {
      const parsed = JSON.parse(input) as Record<string, unknown>;
      const params = new URLSearchParams();

      Object.entries(parsed).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => params.append(key, String(item)));
          return;
        }

        if (value !== null && value !== undefined) {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const normalizedBase = baseUrl.trim();
      const fullUrl = normalizedBase ? `${normalizedBase}${queryString ? `?${queryString}` : ''}` : `?${queryString}`;

      return {
        base: normalizedBase,
        entries: Array.from(params.entries()),
        primaryOutput: queryString,
        secondaryOutput: fullUrl,
        error: '',
      };
    } catch (builderError) {
      return {
        base: baseUrl.trim(),
        entries: [],
        primaryOutput: '',
        secondaryOutput: '',
        error: builderError instanceof Error ? builderError.message : 'Invalid JSON input.',
      };
    }
  }, [baseUrl, input, mode]);

  const copy = async () => {
    if (!result.primaryOutput) return;
    await navigator.clipboard.writeText(result.primaryOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const switchMode = (nextMode: 'parse' | 'build') => {
    setMode(nextMode);
    setInput(nextMode === 'parse' ? SAMPLE_URL : SAMPLE_JSON);
    setCopied(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-[18px] bg-slate-100 p-1 dark:bg-slate-900/70">
        {([
          ['parse', 'URL to JSON'],
          ['build', 'JSON to query'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => switchMode(value)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
              mode === value
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {mode === 'parse' ? 'URL or query string' : 'JSON input'}
        </p>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="tool-textarea font-mono text-[13px] leading-6"
          style={{ minHeight: 180 }}
          spellCheck={false}
        />
      </div>

      {mode === 'build' && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Base URL</p>
          <input
            type="text"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="https://devboosty.app/tools"
          />
        </div>
      )}

      {result.base && (
        <div className="rounded-[20px] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            {mode === 'parse' ? 'Base URL' : 'URL preview'}
          </p>
          <p className="mt-2 break-all font-mono text-sm text-slate-900 dark:text-white">
            {mode === 'parse' ? result.base : result.secondaryOutput}
          </p>
        </div>
      )}

      {result.error && (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {result.error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {mode === 'parse' ? 'Parsed params' : 'Generated params'}
          </p>
          <div className="mt-4 space-y-2">
            {result.entries.length ? result.entries.map(([key, value], index) => (
              <div key={`${key}-${index}`} className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                <span className="font-semibold text-slate-900 dark:text-white">{key}</span>
                <span className="font-mono text-slate-500 dark:text-slate-300">{value}</span>
              </div>
            )) : <p className="text-sm text-slate-400 dark:text-slate-500">No parameters detected.</p>}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {mode === 'parse' ? 'JSON view' : 'Query string'}
            </p>
            <button type="button" onClick={copy} className="btn-secondary px-4 py-2 text-xs" disabled={!result.primaryOutput}>
              {copied ? 'Copied' : mode === 'parse' ? 'Copy JSON' : 'Copy query'}
            </button>
          </div>
          <textarea
            value={result.primaryOutput}
            readOnly
            className="tool-textarea mt-4 bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 280 }}
          />
        </div>
      </div>
    </div>
  );
}
