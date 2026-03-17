'use client';
// src/components/tools/NumberBaseConverter.tsx

import { useState } from 'react';

const BASES = [
  { label: 'Binary', prefix: '0b', base: 2 },
  { label: 'Octal', prefix: '0o', base: 8 },
  { label: 'Decimal', prefix: '', base: 10 },
  { label: 'Hexadecimal', prefix: '0x', base: 16 },
];

function convert(value: string, fromBase: number): Record<number, string> {
  if (!value.trim()) return { 2: '', 8: '', 10: '', 16: '' };
  try {
    const decimal = parseInt(value.replace(/^0[box]/i, ''), fromBase);
    if (isNaN(decimal)) return { 2: 'Invalid', 8: 'Invalid', 10: 'Invalid', 16: 'Invalid' };
    return {
      2: decimal.toString(2),
      8: decimal.toString(8),
      10: decimal.toString(10),
      16: decimal.toString(16).toUpperCase(),
    };
  } catch {
    return { 2: 'Error', 8: 'Error', 10: 'Error', 16: 'Error' };
  }
}

export default function NumberBaseConverter() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [copied, setCopied] = useState<number | null>(null);

  const result = convert(input, fromBase);

  const copy = (text: string, base: number) => {
    if (!text || text === 'Invalid' || text === 'Error') return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(base);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="space-y-6">
      {/* Input section */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Input Base</label>
          <div className="flex flex-wrap gap-2">
            {BASES.map(({ label, base }) => (
              <button
                key={base}
                onClick={() => { setFromBase(base); setInput(''); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  fromBase === base
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-brand-400'
                }`}
              >
                {label} ({base})
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Enter {BASES.find(b => b.base === fromBase)?.label} number:
          </label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={fromBase === 2 ? '1010101' : fromBase === 8 ? '17' : fromBase === 16 ? 'FF or 0xFF' : '255'}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 font-mono text-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BASES.map(({ label, prefix, base }) => {
          const val = result[base];
          const isSource = base === fromBase;
          return (
            <div
              key={base}
              className={`p-4 rounded-xl border transition-all ${
                isSource
                  ? 'bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {label} (Base {base})
                </span>
                {!isSource && val && val !== 'Invalid' && val !== 'Error' && (
                  <button
                    onClick={() => copy(val, base)}
                    className="text-xs text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {copied === base ? '✓ Copied' : 'Copy'}
                  </button>
                )}
                {isSource && <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">Input</span>}
              </div>
              <div className={`font-mono text-lg font-bold ${
                val === 'Invalid' || val === 'Error'
                  ? 'text-red-500'
                  : 'text-slate-800 dark:text-slate-100'
              }`}>
                {val ? (prefix && val !== 'Invalid' && val !== 'Error' ? prefix : '') + val : (
                  <span className="text-slate-300 dark:text-slate-600 font-normal text-sm">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick reference */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              {['Decimal', 'Binary', 'Octal', 'Hex'].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-bold uppercase text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0,1,2,4,8,10,15,16,32,64,100,128,255].map(n => (
              <tr key={n} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-3 py-1.5 font-mono border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">{n}</td>
                <td className="px-3 py-1.5 font-mono border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">{n.toString(2)}</td>
                <td className="px-3 py-1.5 font-mono border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">{n.toString(8)}</td>
                <td className="px-3 py-1.5 font-mono border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300">{n.toString(16).toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
