'use client';
// src/components/tools/RobotsTxtGenerator.tsx
import { useState } from 'react';
interface Rule { agent: string; allow: string; disallow: string; }
export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState<Rule[]>([{ agent: '*', allow: '/', disallow: '/admin/\n/private/' }]);
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [copied, setCopied] = useState(false);
  const addRule = () => setRules(r => [...r, { agent: 'Googlebot', allow: '', disallow: '' }]);
  const update = (i: number, k: keyof Rule, v: string) => setRules(r => r.map((rule, idx) => idx === i ? { ...rule, [k]: v } : rule));
  const remove = (i: number) => setRules(r => r.filter((_, idx) => idx !== i));
  const output = rules.map(r => [
    `User-agent: ${r.agent}`,
    ...(r.allow ? r.allow.split('\n').map(a => `Allow: ${a.trim()}`).filter(Boolean) : []),
    ...(r.disallow ? r.disallow.split('\n').map(d => `Disallow: ${d.trim()}`).filter(Boolean) : []),
    crawlDelay ? `Crawl-delay: ${crawlDelay}` : '',
  ].filter(Boolean).join('\n')).join('\n\n') + (sitemap ? `\n\nSitemap: ${sitemap}` : '');
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="space-y-5">
      {rules.map((r, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-semibold text-slate-700">Rule #{i + 1}</label>
            {rules.length > 1 && <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-600">Remove</button>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div><label className="text-xs text-slate-500 mb-1 block">User-agent</label>
              <input value={r.agent} onChange={e => update(i, 'agent', e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
            <div><label className="text-xs text-slate-500 mb-1 block">Allow (one per line)</label>
              <textarea value={r.allow} onChange={e => update(i, 'allow', e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" /></div>
            <div><label className="text-xs text-slate-500 mb-1 block">Disallow (one per line)</label>
              <textarea value={r.disallow} onChange={e => update(i, 'disallow', e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" /></div>
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-3 items-center">
        <button onClick={addRule} className="btn-secondary text-sm">+ Add User-agent Rule</button>
        <div className="flex items-center gap-2"><label className="text-sm text-slate-600">Sitemap URL:</label>
          <input value={sitemap} onChange={e => setSitemap(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" style={{ width: 280 }} /></div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-sm font-semibold text-slate-700">robots.txt Output</label>
          <button onClick={copy} className="btn-primary text-xs">{copied ? '✓ Copied!' : '📋 Copy robots.txt'}</button>
        </div>
        <pre className="tool-textarea bg-slate-900 text-green-300 text-sm font-mono whitespace-pre">{output}</pre>
      </div>
    </div>
  );
}
