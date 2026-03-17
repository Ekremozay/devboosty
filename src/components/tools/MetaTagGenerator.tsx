'use client';
// src/components/tools/MetaTagGenerator.tsx
import { useState } from 'react';
export default function MetaTagGenerator() {
  const [form, setForm] = useState({ title: '', desc: '', keywords: '', author: '', image: '', url: '', robots: 'index, follow', type: 'website' });
  const [copied, setCopied] = useState(false);
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const tags = [
    form.title && `<title>${form.title}</title>`,
    form.desc && `<meta name="description" content="${form.desc}">`,
    form.keywords && `<meta name="keywords" content="${form.keywords}">`,
    form.author && `<meta name="author" content="${form.author}">`,
    `<meta name="robots" content="${form.robots}">`,
    form.url && `<link rel="canonical" href="${form.url}">`,
    `<!-- Open Graph -->`,
    form.title && `<meta property="og:title" content="${form.title}">`,
    form.desc && `<meta property="og:description" content="${form.desc}">`,
    form.image && `<meta property="og:image" content="${form.image}">`,
    form.url && `<meta property="og:url" content="${form.url}">`,
    `<meta property="og:type" content="${form.type}">`,
    `<!-- Twitter Card -->`,
    `<meta name="twitter:card" content="summary_large_image">`,
    form.title && `<meta name="twitter:title" content="${form.title}">`,
    form.desc && `<meta name="twitter:description" content="${form.desc}">`,
    form.image && `<meta name="twitter:image" content="${form.image}">`,
  ].filter(Boolean).join('\n');
  const copy = async () => { await navigator.clipboard.writeText(tags); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const fields = [
    { key: 'title', label: 'Page Title', placeholder: 'Free JSON Formatter Online – Fast & Secure', max: 60 },
    { key: 'desc', label: 'Meta Description', placeholder: 'Format and beautify JSON instantly. No signup required.', max: 160 },
    { key: 'keywords', label: 'Keywords (comma-separated)', placeholder: 'json formatter, json beautifier, format json' },
    { key: 'author', label: 'Author', placeholder: 'Your Name or Brand' },
    { key: 'url', label: 'Canonical URL', placeholder: 'https://example.com/page' },
    { key: 'image', label: 'OG Image URL', placeholder: 'https://example.com/og-image.png' },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, max }) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between">
              <label className="text-sm font-semibold text-slate-700">{label}</label>
              {max && form[key as keyof typeof form] && <span className={`text-xs ${form[key as keyof typeof form].length > max ? 'text-red-500' : 'text-slate-400'}`}>{form[key as keyof typeof form].length}/{max}</span>}
            </div>
            <input type="text" value={form[key as keyof typeof form]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        ))}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Robots</label>
          <select value={form.robots} onChange={e => set('robots', e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option>index, follow</option><option>noindex, nofollow</option><option>noindex, follow</option><option>index, nofollow</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">Generated Meta Tags</label>
          <button onClick={copy} disabled={!tags.trim()} className={`btn-primary text-xs ${!tags.trim() ? 'opacity-50' : ''}`}>{copied ? '✓ Copied!' : '📋 Copy All Tags'}</button>
        </div>
        <pre className="tool-textarea bg-slate-900 text-green-300 text-xs overflow-x-auto whitespace-pre-wrap" style={{ minHeight: 240, fontFamily: 'var(--font-mono)' }}>{tags || '<!-- Fill in the fields above to generate meta tags -->'}</pre>
      </div>
    </div>
  );
}
