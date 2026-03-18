'use client';
// src/components/tools/DuplicateLineRemover.tsx
import { useState } from 'react';
export default function DuplicateLineRemover() {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [copied, setCopied] = useState(false);
  const process = () => {
    const lines = input.split('\n').map(l => trimLines ? l.trim() : l);
    const seen = new Set<string>();
    const unique = lines.filter(l => {
      const key = caseSensitive ? l : l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    return { output: unique.join('\n'), removed: lines.length - unique.length };
  };
  const { output, removed } = process();
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 items-center">
        {[['caseSensitive', 'Case-sensitive matching', caseSensitive, () => setCaseSensitive(v => !v)], ['trimLines', 'Trim whitespace', trimLines, () => setTrimLines(v => !v)]].map(([k, l, v, fn]) => (
          <label key={k as string} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
            <input type="checkbox" checked={v as boolean} onChange={fn as () => void} className="rounded accent-brand-600" />{l as string}
          </label>
        ))}
        {removed > 0 && <span className="text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">🗑 {removed} duplicate{removed !== 1 ? 's' : ''} removed</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input ({input.split('\n').filter(Boolean).length} lines)</label>
          <textarea className="tool-textarea" value={input} onChange={e => setInput(e.target.value)} placeholder={"apple\nbanana\napple\ncherry\nbanana\ndate"} style={{ minHeight: 260 }} /></div>
        <div className="space-y-2"><div className="flex justify-between"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unique Lines ({output.split('\n').filter(Boolean).length})</label>
          <button onClick={copy} disabled={!output} className="btn-ghost text-xs">{copied ? '✓ Copied' : 'Copy'}</button></div>
          <textarea className="tool-textarea bg-slate-50 dark:bg-slate-900/50" value={output} readOnly style={{ minHeight: 260 }} /></div>
      </div>
    </div>
  );
}
