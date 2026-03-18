'use client';
// src/components/tools/RemoveLineBreaks.tsx
import { useState } from 'react';
export default function RemoveLineBreaks() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'join' | 'single' | 'double'>('join');
  const [copied, setCopied] = useState(false);
  const output = mode === 'join' ? input.replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim()
    : mode === 'single' ? input.replace(/\r?\n\r?\n+/g, '\n').trim()
    : input.replace(/\r?\n+/g, '\n\n').trim();
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="space-y-5">
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl w-fit">
        {[['join', 'Join all into one line'], ['single', 'Remove extra blank lines'], ['double', 'Double-space paragraphs']].map(([k, l]) => (
          <button key={k} onClick={() => setMode(k as 'join'|'single'|'double')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === k ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>{l}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input</label>
          <textarea className="tool-textarea" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste text with unwanted line breaks here..." style={{ minHeight: 260 }} /></div>
        <div className="space-y-2"><div className="flex justify-between"><label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Output</label>
          <button onClick={copy} disabled={!output} className="btn-ghost text-xs">{copied ? '✓ Copied' : 'Copy'}</button></div>
          <textarea className="tool-textarea bg-slate-50 dark:bg-slate-900/50" value={output} readOnly style={{ minHeight: 260 }} /></div>
      </div>
    </div>
  );
}
