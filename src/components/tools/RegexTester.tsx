'use client';
// src/components/tools/RegexTester.tsx
import { useState, useMemo } from 'react';
export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello World! foo@bar.com and test@example.org are email addresses.');
  const [replacement, setReplacement] = useState('');
  const [showReplace, setShowReplace] = useState(false);

  const result = useMemo(() => {
    if (!pattern) return null;
    try {
      const rx = new RegExp(pattern, flags);
      const matches = Array.from(testString.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')));
      const replaced = showReplace ? testString.replace(rx, replacement) : null;
      return { valid: true, count: matches.length, matches: matches.slice(0, 50).map(m => ({ value: m[0], index: m.index ?? 0, groups: m.slice(1) })), replaced };
    } catch (e: unknown) { return { valid: false, error: e instanceof Error ? e.message : 'Invalid regex' }; }
  }, [pattern, flags, testString, replacement, showReplace]);

  const highlightedText = useMemo(() => {
    if (!result?.valid || !result.matches?.length) return testString;
    let last = 0; const parts: { text: string; match: boolean }[] = [];
    result.matches.forEach(m => {
      if (m.index > last) parts.push({ text: testString.slice(last, m.index), match: false });
      parts.push({ text: m.value, match: true });
      last = m.index + m.value.length;
    });
    if (last < testString.length) parts.push({ text: testString.slice(last), match: false });
    return parts;
  }, [result, testString]);

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-semibold text-slate-700">Regular Expression</label>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
            <span className="px-3 text-slate-400 font-mono text-lg select-none">/</span>
            <input type="text" value={pattern} onChange={e => setPattern(e.target.value)}
              placeholder="([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})"
              className="flex-1 py-2.5 font-mono text-sm focus:outline-none bg-white text-slate-800" />
            <span className="text-slate-400 font-mono text-lg select-none">/</span>
            <input type="text" value={flags} onChange={e => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
              className="w-16 px-3 py-2.5 font-mono text-sm focus:outline-none bg-slate-50 text-slate-700 border-l border-slate-200" placeholder="gim" />
          </div>
        </div>
      </div>
      {result && !result.valid && <div className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">⚠ {(result as { error: string }).error}</div>}
      {result?.valid && <div className={`text-sm font-semibold px-4 py-2 rounded-xl border ${result.count ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
        {result.count ? `✓ ${result.count} match${result.count !== 1 ? 'es' : ''} found` : 'No matches'}
      </div>}
      <div className="space-y-2">
        <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Test String</label></div>
        <textarea className="tool-textarea" value={testString} onChange={e => setTestString(e.target.value)} style={{ minHeight: 120 }} />
      </div>
      {result?.valid && (result.matches ?? []).length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <h3 className="font-semibold text-sm text-slate-700 mb-3">Preview (matches highlighted)</h3>
          <div className="font-mono text-sm leading-relaxed break-all">
            {Array.isArray(highlightedText)
              ? highlightedText.map((p, i) => p.match
                ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5 not-italic">{p.text}</mark>
                : <span key={i}>{p.text}</span>)
              : highlightedText}
          </div>
        </div>
      )}
      {result?.valid && (result.matches ?? []).length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
          <h3 className="font-semibold text-sm text-slate-700">Matches</h3>
          {(result.matches ?? []).slice(0, 20).map((m, i) => (
            <div key={i} className="flex items-start gap-3 text-xs font-mono bg-slate-50 rounded-lg px-3 py-2">
              <span className="text-slate-400 w-6 text-right flex-shrink-0">{i + 1}</span>
              <span className="font-semibold text-brand-700 break-all">{m.value}</span>
              <span className="text-slate-400 flex-shrink-0">@{m.index}</span>
              {m.groups.length > 0 && <span className="text-slate-500">Groups: [{m.groups.join(', ')}]</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
