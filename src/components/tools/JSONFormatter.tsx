'use client';
// src/components/tools/JSONFormatter.tsx

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type Mode = 'format' | 'minify' | 'validate';

export default function JSONFormatter() {
  const t = useTranslations('tools.jsonFormatter');
  const tc = useTranslations('tool');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState<Mode>('format');
  const [copied, setCopied] = useState(false);

  const process = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    try {
      const parsed = JSON.parse(input);
      setError('');
      if (mode === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput(JSON.stringify(parsed, null, indent));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setError(msg);
      setOutput('');
    }
  }, [input, indent, mode]);

  const handleInput = (val: string) => {
    setInput(val);
    setError('');
    setOutput('');
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    handleInput(`{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"Anytown","state":"CA"},"hobbies":["reading","coding","hiking"],"active":true}`);
  };

  const clear = () => { setInput(''); setOutput(''); setError(''); };

  const modeLabels: Record<Mode, string> = {
    format: t('modeFormat'),
    minify: t('modeMinify'),
    validate: t('modeValidate'),
  };

  const actionLabels: Record<Mode, string> = {
    format: t('formatAction'),
    minify: t('minifyAction'),
    validate: t('validateAction'),
  };

  const actionIcons: Record<Mode, string> = {
    format: '✨',
    minify: '⚡',
    validate: '✓',
  };

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit dark:bg-slate-800/50">
        {(['format', 'minify', 'validate'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all sm:px-4 ${
              mode === m
                ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('inputLabel')}</label>
            <div className="flex gap-1 sm:gap-2">
              <button onClick={loadSample} className="btn-ghost text-xs">{tc('loadSample')}</button>
              <button onClick={clear} className="btn-ghost text-xs">{tc('clear')}</button>
            </div>
          </div>
          <textarea
            className={`tool-textarea ${error ? 'border-red-300 ring-1 ring-red-200 dark:border-red-500/50 dark:ring-red-500/20' : ''}`}
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder={t('placeholder')}
            spellCheck={false}
            style={{ minHeight: 280 }}
          />
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              <span className="mt-0.5 text-red-500">⚠</span>
              <span className="font-mono text-xs leading-relaxed">{error}</span>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('outputLabel')} {output && <span className="text-xs font-normal text-slate-400 dark:text-slate-500">({tc('chars', { count: output.length })})</span>}
            </label>
            <button
              onClick={copyOutput}
              disabled={!output}
              className={`btn-ghost text-xs ${!output ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              {copied ? tc('copied') : tc('copy')}
            </button>
          </div>
          <textarea
            className="tool-textarea bg-slate-50 dark:bg-slate-900/50"
            value={output}
            readOnly
            placeholder={tc('outputPlaceholder')}
            style={{ minHeight: 280 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {mode === 'format' && (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{tc('indent')}:</span>
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`h-8 w-8 rounded-lg font-mono text-sm font-semibold transition-all ${
                  indent === n
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setIndent(0)}
              className={`h-8 rounded-lg px-3 text-xs font-medium transition-all ${
                indent === 0
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {tc('tab')}
            </button>
          </div>
        )}

        <button
          onClick={process}
          disabled={!input.trim()}
          className={`btn-primary ${!input.trim() ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {actionIcons[mode]} {actionLabels[mode]}
        </button>

        {mode === 'validate' && input.trim() && (
          <div className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${
            error
              ? 'border-red-100 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400'
              : 'border-green-100 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400'
          }`}>
            {error ? `✗ ${t('invalidJson')}` : `✓ ${t('validJson')}`}
          </div>
        )}
      </div>
    </div>
  );
}
