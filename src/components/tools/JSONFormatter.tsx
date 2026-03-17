'use client';
// src/components/tools/JSONFormatter.tsx

import { useState, useCallback } from 'react';

type Mode = 'format' | 'minify' | 'validate';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [mode, setMode] = useState<Mode>('format');
  const [copied, setCopied] = useState(false);

  const process = useCallback(() => {
    if (!input.trim()) { setOutput(''); setError(''); return; }
    try {
      const parsed = JSON.parse(input);
      setError('');
      if (mode === 'minify') {
        setOutput(JSON.stringify(parsed));
      } else {
        setOutput(JSON.stringify(parsed, null, indent));
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setError(msg);
      setOutput('');
    }
  }, [input, indent, mode]);

  const handleInput = (val: string) => {
    setInput(val);
    setError('');
    setOutput('');
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    handleInput(`{"name":"John Doe","age":30,"email":"john@example.com","address":{"street":"123 Main St","city":"Anytown","state":"CA"},"hobbies":["reading","coding","hiking"],"active":true}`);
  };

  const clear = () => { setInput(''); setOutput(''); setError(''); };

  const isValid = input.trim() && !error;
  const hasProcessed = !!output;

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {(['format', 'minify', 'validate'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              mode === m
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Input JSON</label>
            <div className="flex gap-2">
              <button onClick={loadSample} className="btn-ghost text-xs">Load Sample</button>
              <button onClick={clear} className="btn-ghost text-xs">Clear</button>
            </div>
          </div>
          <textarea
            className={`tool-textarea ${error ? 'border-red-300 ring-1 ring-red-200' : ''}`}
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder='{"key": "value", "array": [1, 2, 3]}'
            spellCheck={false}
            style={{ minHeight: 320 }}
          />
          {error && (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm">
              <span className="text-red-500 mt-0.5">⚠</span>
              <span className="font-mono text-xs leading-relaxed">{error}</span>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Output {output && <span className="text-xs font-normal text-slate-400">({output.length} chars)</span>}
            </label>
            <button
              onClick={copyOutput}
              disabled={!output}
              className={`btn-ghost text-xs ${!output ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            className="tool-textarea bg-slate-50"
            value={output}
            readOnly
            placeholder="Output will appear here..."
            style={{ minHeight: 320 }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {mode === 'format' && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 font-medium">Indent:</span>
            {[2, 4].map(n => (
              <button
                key={n}
                onClick={() => setIndent(n)}
                className={`w-8 h-8 rounded-lg text-sm font-mono font-semibold transition-all ${
                  indent === n ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setIndent(0)}
              className={`px-3 h-8 rounded-lg text-xs font-medium transition-all ${
                indent === 0 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tab
            </button>
          </div>
        )}

        <button
          onClick={process}
          disabled={!input.trim()}
          className={`btn-primary ${!input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {mode === 'format' ? '✨ Format JSON' : mode === 'minify' ? '⚡ Minify JSON' : '✓ Validate JSON'}
        </button>

        {mode === 'validate' && input.trim() && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${
            error
              ? 'bg-red-50 text-red-700 border border-red-100'
              : 'bg-green-50 text-green-700 border border-green-100'
          }`}>
            {error ? '✗ Invalid JSON' : '✓ Valid JSON'}
          </div>
        )}
      </div>
    </div>
  );
}
