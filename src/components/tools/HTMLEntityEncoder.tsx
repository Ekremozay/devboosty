'use client';
// src/components/tools/HTMLEntityEncoder.tsx

import { useState } from 'react';

const NAMED_ENTITIES: [string, string][] = [
  ['&', '&amp;'], ['<', '&lt;'], ['>', '&gt;'], ['"', '&quot;'], ["'", '&apos;'],
  ['©', '&copy;'], ['®', '&reg;'], ['™', '&trade;'], ['€', '&euro;'], ['£', '&pound;'],
  ['¥', '&yen;'], ['°', '&deg;'], ['±', '&plusmn;'], ['×', '&times;'], ['÷', '&divide;'],
  ['→', '&rarr;'], ['←', '&larr;'], ['↑', '&uarr;'], ['↓', '&darr;'], ['↔', '&harr;'],
  ['♥', '&hearts;'], ['♠', '&spades;'], ['♦', '&diams;'], ['♣', '&clubs;'],
  ['—', '&mdash;'], ['–', '&ndash;'], [' ', '&nbsp;'],
];

function encodeHTML(text: string, mode: 'named' | 'numeric'): string {
  if (mode === 'named') {
    let result = text;
    for (const [char, entity] of NAMED_ENTITIES) {
      result = result.split(char).join(entity);
    }
    return result;
  }
  // numeric: encode non-ASCII + special chars
  return text.replace(/[^\x20-\x7E]|[<>&"']/g, c => `&#${c.charCodeAt(0)};`);
}

function decodeHTML(text: string): string {
  if (typeof document !== 'undefined') {
    const el = document.createElement('textarea');
    el.innerHTML = text;
    return el.value;
  }
  // SSR fallback
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

export default function HTMLEntityEncoder() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode-named' | 'encode-numeric' | 'decode'>('encode-named');
  const [copied, setCopied] = useState(false);

  const output = (() => {
    if (!input.trim()) return '';
    if (mode === 'decode') return decodeHTML(input);
    if (mode === 'encode-numeric') return encodeHTML(input, 'numeric');
    return encodeHTML(input, 'named');
  })();

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const swap = () => {
    setInput(output);
  };

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {[
          { value: 'encode-named', label: 'Encode (Named)' },
          { value: 'encode-numeric', label: 'Encode (Numeric)' },
          { value: 'decode', label: 'Decode' },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => setMode(opt.value as typeof mode)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              mode === opt.value
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-brand-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* I/O */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {mode === 'decode' ? 'HTML with Entities' : 'Plain Text / HTML'}
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            className="tool-textarea"
            placeholder={mode === 'decode' ? '&lt;div&gt;Hello &amp; World&lt;/div&gt;' : '<div>Hello & World © 2025</div>'}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {mode === 'decode' ? 'Decoded Text' : 'Encoded HTML'}
            </label>
            <button onClick={copy} className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            className="tool-textarea bg-slate-50 dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={() => setInput('')} className="btn-secondary">Clear</button>
        <button onClick={swap} disabled={!output} className="btn-secondary disabled:opacity-50">
          ⇅ Use Output as Input
        </button>
      </div>

      {/* Reference table */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Common HTML Entities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {NAMED_ENTITIES.slice(0, 16).map(([char, entity]) => (
            <div
              key={entity}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 px-3 py-2 cursor-pointer hover:border-brand-300 transition-colors"
              onClick={() => setInput(prev => prev + char)}
              title="Click to insert"
            >
              <span className="text-lg w-6 text-center">{char}</span>
              <code className="text-xs text-brand-600 dark:text-brand-400">{entity}</code>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Click any entity to insert it into the input.</p>
      </div>
    </div>
  );
}
