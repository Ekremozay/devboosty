'use client';
// src/components/tools/Base64Tool.tsx

import { useState } from 'react';

type Mode = 'encode' | 'decode';

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = (value = input, m = mode) => {
    if (!value.trim()) { setOutput(''); setError(''); return; }
    try {
      if (m === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(value))));
        setError('');
      } else {
        setOutput(decodeURIComponent(escape(atob(value.trim()))));
        setError('');
      }
    } catch {
      setError(m === 'decode' ? 'Invalid Base64 string. Ensure there are no extra spaces or characters.' : 'Encoding failed.');
      setOutput('');
    }
  };

  const handleInput = (val: string) => { setInput(val); process(val, mode); };
  const switchMode = () => {
    const next: Mode = mode === 'encode' ? 'decode' : 'encode';
    setMode(next);
    // Swap input/output
    setInput(output);
    process(output, next);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
          {(['encode', 'decode'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); process(input, m); }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                mode === m ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {m === 'encode' ? '🔒 Encode' : '🔓 Decode'}
            </button>
          ))}
        </div>
        <button onClick={switchMode} className="btn-ghost text-xs" title="Swap input and output">
          ⇄ Swap
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {mode === 'encode' ? 'Plain Text' : 'Base64 String'}
          </label>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 to decode...'}
            spellCheck={false}
            style={{ minHeight: 260 }}
          />
          <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost text-xs">Clear</button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
            </label>
            <button onClick={copy} disabled={!output} className={`btn-ghost text-xs ${!output ? 'opacity-40' : ''}`}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            className="tool-textarea bg-slate-50 dark:bg-slate-900/50"
            value={output}
            readOnly
            placeholder="Output will appear here automatically..."
            style={{ minHeight: 260 }}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {output && (
        <div className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-lg px-3 py-2 flex gap-4">
          <span>Input: {input.length} chars</span>
          <span>Output: {output.length} chars</span>
          {mode === 'encode' && <span>Size increase: {((output.length / input.length - 1) * 100).toFixed(0)}%</span>}
        </div>
      )}
    </div>
  );
}
