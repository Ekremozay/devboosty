'use client';
// src/components/tools/JSONMinify.tsx
import { useState } from 'react';
export default function JSONMinify() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const minify = () => {
    if (!input.trim()) return;
    try { setOutput(JSON.stringify(JSON.parse(input))); setError(''); } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Invalid JSON'); setOutput(''); }
  };
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const savings = output && input ? Math.round((1 - output.length / input.length) * 100) : 0;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2"><label className="text-sm font-semibold text-slate-700">Formatted JSON</label>
          <textarea className="tool-textarea" value={input} onChange={e => { setInput(e.target.value); setOutput(''); setError(''); }} placeholder='{\n  "key": "value",\n  "array": [1, 2, 3]\n}' style={{ minHeight: 280 }} /></div>
        <div className="space-y-2"><div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Minified JSON {output && <span className="text-xs font-normal text-green-600">(-{savings}%)</span>}</label>
          <button onClick={copy} disabled={!output} className="btn-ghost text-xs">{copied ? '✓ Copied' : 'Copy'}</button></div>
          <textarea className="tool-textarea bg-slate-50" value={output} readOnly style={{ minHeight: 280 }} /></div>
      </div>
      {error && <div className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">⚠ {error}</div>}
      <button onClick={minify} disabled={!input.trim()} className={`btn-primary ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>⚡ Minify JSON</button>
    </div>
  );
}
