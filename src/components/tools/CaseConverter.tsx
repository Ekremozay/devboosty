'use client';
// src/components/tools/CaseConverter.tsx
import { useState } from 'react';

const CASES = [
  { key: 'upper', label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
  { key: 'lower', label: 'lowercase', fn: (s: string) => s.toLowerCase() },
  { key: 'title', label: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) },
  { key: 'sentence', label: 'Sentence case', fn: (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { key: 'camel', label: 'camelCase', fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
  { key: 'pascal', label: 'PascalCase', fn: (s: string) => { const c = s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase()); return c.charAt(0).toUpperCase() + c.slice(1); } },
  { key: 'snake', label: 'snake_case', fn: (s: string) => s.replace(/\W+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase() },
  { key: 'kebab', label: 'kebab-case', fn: (s: string) => s.replace(/\W+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() },
  { key: 'constant', label: 'CONSTANT_CASE', fn: (s: string) => s.replace(/\W+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase() },
] as const;

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState('');

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input Text</label>
        <textarea className="tool-textarea" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Type or paste your text here..." style={{ minHeight: 120 }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CASES.map(({ key, label, fn }) => {
          const result = fn(input);
          return (
            <div key={key} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-2 hover:border-slate-200 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
                <button onClick={() => copy(result, key)} className="btn-ghost text-xs">
                  {copied === key ? '✓' : 'Copy'}
                </button>
              </div>
              <p className="font-mono text-sm text-slate-800 dark:text-slate-200 break-all min-h-[2.5rem] leading-relaxed">
                {result || <span className="text-slate-300 dark:text-slate-600 italic">output</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
