'use client';
// src/components/tools/KeywordDensity.tsx
import { useState, useMemo } from 'react';
export default function KeywordDensity() {
  const [text, setText] = useState('');
  const [minLen, setMinLen] = useState(3);
  const results = useMemo(() => {
    if (!text.trim()) return [];
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length >= minLen);
    const total = words.length;
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([word, count]) => ({ word, count, density: ((count / total) * 100).toFixed(2) }));
  }, [text, minLen]);
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-slate-700">Content</label>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            Min word length: <select value={minLen} onChange={e => setMinLen(+e.target.value)} className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white">
              {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <textarea className="tool-textarea" value={text} onChange={e => setText(e.target.value)} placeholder="Paste your article or page content here to analyze keyword density..." style={{ minHeight: 200 }} />
      </div>
      {results.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-700">Top Keywords</h3>
            <span className="text-xs text-slate-400">{text.trim().split(/\s+/).filter(Boolean).length} total words</span>
          </div>
          <div className="divide-y divide-slate-50">
            {results.map(({ word, count, density }, i) => (
              <div key={word} className="px-4 py-2.5 flex items-center gap-3">
                <span className="w-6 text-xs text-slate-400 text-right">{i + 1}</span>
                <span className="flex-1 font-medium text-slate-800 text-sm">{word}</span>
                <span className="text-xs text-slate-500 w-16 text-right">{count}×</span>
                <div className="w-24 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-400 rounded-full" style={{ width: `${Math.min(100, +density * 10)}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-brand-600 w-10 text-right">{density}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
