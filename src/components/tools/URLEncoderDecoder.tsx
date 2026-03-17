'use client';
// src/components/tools/URLEncoderDecoder.tsx
import { useState } from 'react';
type Mode = 'encode' | 'decode';
export default function URLEncoderDecoder() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = (val = input, m = mode) => {
    if (!val) { setOutput(''); setError(''); return; }
    try {
      setOutput(m === 'encode' ? encodeURIComponent(val) : decodeURIComponent(val));
      setError('');
    } catch { setError('Invalid URL-encoded string.'); setOutput(''); }
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {(['encode', 'decode'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); process(input, m); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${mode === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {m === 'encode' ? '🔗 Encode' : '🔓 Decode'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">{mode === 'encode' ? 'Plain URL / Text' : 'Encoded URL'}</label>
          <textarea className="tool-textarea" value={input} onChange={e => { setInput(e.target.value); process(e.target.value, mode); }}
            placeholder={mode === 'encode' ? 'https://example.com/search?q=hello world' : 'https%3A%2F%2Fexample.com'} style={{ minHeight: 200 }} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between"><label className="text-sm font-semibold text-slate-700">Output</label>
            <button onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} disabled={!output} className="btn-ghost text-xs">{copied ? '✓ Copied' : 'Copy'}</button></div>
          <textarea className="tool-textarea bg-slate-50" value={output} readOnly style={{ minHeight: 200 }} />
        </div>
      </div>
      {error && <div className="text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">⚠ {error}</div>}
    </div>
  );
}
