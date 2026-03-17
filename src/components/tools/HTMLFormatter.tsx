'use client';
// src/components/tools/HTMLFormatter.tsx
import { useState } from 'react';
function formatHTML(html: string, indent = 2): string {
  const tab = ' '.repeat(indent);
  let level = 0, result = '';
  html = html.replace(/>\s+</g, '><').trim();
  const tokens = html.split(/(<[^>]+>)/g);
  tokens.forEach(token => {
    if (!token.trim()) return;
    if (/^<\//.test(token)) { level = Math.max(0, level - 1); result += tab.repeat(level) + token + '\n'; }
    else if (/^<[^!][^>]*[^/]>$/.test(token) || /^<[a-zA-Z][^>]*>$/.test(token)) { result += tab.repeat(level) + token + '\n'; level++; }
    else { result += tab.repeat(level) + token + '\n'; }
  });
  return result.trim();
}
export default function HTMLFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const format = () => { try { setOutput(formatHTML(input)); } catch { setOutput(input); } };
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2"><label className="text-sm font-semibold text-slate-700">Input HTML</label>
          <textarea className="tool-textarea" value={input} onChange={e => setInput(e.target.value)} placeholder="<html><head><title>Page</title></head><body><h1>Hello</h1></body></html>" style={{ minHeight: 300 }} /></div>
        <div className="space-y-2"><div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Formatted HTML</label>
          <button onClick={copy} disabled={!output} className="btn-ghost text-xs">{copied ? '✓ Copied' : 'Copy'}</button></div>
          <textarea className="tool-textarea bg-slate-50" value={output} readOnly style={{ minHeight: 300 }} /></div>
      </div>
      <button onClick={format} disabled={!input.trim()} className={`btn-primary ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}>🎨 Format HTML</button>
    </div>
  );
}
