'use client';
// src/components/tools/SlugGenerator.tsx
import { useState } from 'react';
function toSlug(s: string): string {
  return s.toLowerCase().trim()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}
export default function SlugGenerator() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const slug = toSlug(input);
  const copy = async () => { await navigator.clipboard.writeText(slug); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const samples = ['How to Format JSON: A Complete Guide', 'Best Free Online Developer Tools 2024', 'Getting Started with Next.js and Tailwind CSS'];
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Title or Phrase</label>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="How to Format JSON: A Complete Guide"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 text-base" />
      </div>
      {slug && (
        <div className="bg-slate-900 rounded-xl p-5 flex items-center justify-between gap-4">
          <code className="text-green-400 text-base font-mono break-all">{slug}</code>
          <button onClick={copy} className="btn-secondary text-xs flex-shrink-0">{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
      )}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-600">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {samples.map(s => <button key={s} onClick={() => setInput(s)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors">{s}</button>)}
        </div>
      </div>
    </div>
  );
}
