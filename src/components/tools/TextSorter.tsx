'use client';
// src/components/tools/TextSorter.tsx
import { useState } from 'react';
export default function TextSorter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'az'|'za'|'len'|'rand'|'num'>('az');
  const [removeDups, setRemoveDups] = useState(false);
  const [copied, setCopied] = useState(false);
  const process = () => {
    let lines = input.split('\n');
    if (removeDups) lines = Array.from(new Set(lines.map(l => l.trim()))).filter(Boolean);
    switch (mode) {
      case 'az': lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })); break;
      case 'za': lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' })); break;
      case 'len': lines.sort((a, b) => a.length - b.length); break;
      case 'rand': for (let i = lines.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]]; } break;
      case 'num': lines.sort((a, b) => parseFloat(a) - parseFloat(b)); break;
    }
    return lines.join('\n');
  };
  const [output, setOutput] = useState('');
  const run = () => setOutput(process());
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {[['az','A → Z'],['za','Z → A'],['len','By length'],['num','Numeric'],['rand','Random']].map(([k,l]) => (
            <button key={k} onClick={() => setMode(k as 'az')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === k ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>{l}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input type="checkbox" checked={removeDups} onChange={e => setRemoveDups(e.target.checked)} className="rounded accent-brand-600" />
          Remove duplicates
        </label>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2"><label className="text-sm font-semibold text-slate-700">Input (one item per line)</label>
          <textarea className="tool-textarea" value={input} onChange={e => setInput(e.target.value)} placeholder={"banana\napple\ncherry\ndate"} style={{ minHeight: 260 }} /></div>
        <div className="space-y-2"><div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Sorted Output</label>
          <button onClick={copy} disabled={!output} className="btn-ghost text-xs">{copied ? '✓ Copied' : 'Copy'}</button></div>
          <textarea className="tool-textarea bg-slate-50" value={output} readOnly style={{ minHeight: 260 }} /></div>
      </div>
      <button onClick={run} disabled={!input.trim()} className={`btn-primary ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>🔤 Sort Lines</button>
    </div>
  );
}
