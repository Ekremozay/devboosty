'use client';

import { useState, useCallback } from 'react';
import { stringify, parse } from 'yaml';

type Mode = 'yamlToJson' | 'jsonToYaml';

const SAMPLE_YAML = `name: devboosty
version: 1.0.0
features:
  - json-formatter
  - base64-encoder
  - ai-chat
config:
  theme: dark
  language: en
  maxPanels: 3
database:
  host: localhost
  port: 5432
  ssl: true`;

const SAMPLE_JSON = `{
  "name": "devboosty",
  "version": "1.0.0",
  "features": ["json-formatter", "base64-encoder", "ai-chat"],
  "config": {
    "theme": "dark",
    "language": "en",
    "maxPanels": 3
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "ssl": true
  }
}`;

export default function YAMLJSONConverter() {
  const [mode, setMode] = useState<Mode>('yamlToJson');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) { setError('Please enter some content to convert.'); return; }
    setError('');
    try {
      if (mode === 'yamlToJson') {
        const parsed = parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(stringify(parsed));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed.');
    }
  }, [input, mode]);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const loadSample = () => {
    setInput(mode === 'yamlToJson' ? SAMPLE_YAML : SAMPLE_JSON);
    setOutput('');
    setError('');
  };

  const swap = () => {
    const next: Mode = mode === 'yamlToJson' ? 'jsonToYaml' : 'yamlToJson';
    setMode(next);
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        Convert between YAML and JSON formats instantly. Supports nested objects, arrays, booleans, and numbers.
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {([
          { key: 'yamlToJson', label: 'YAML → JSON' },
          { key: 'jsonToYaml', label: 'JSON → YAML' },
        ] as { key: Mode; label: string }[]).map(m => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setInput(''); setOutput(''); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              mode === m.key
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={convert} className="btn-primary" disabled={!input.trim()}>⇄ Convert</button>
        <button onClick={loadSample} className="btn-ghost">Load sample</button>
        {output && <button onClick={swap} className="btn-ghost">↔ Swap & reverse</button>}
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">Clear</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {mode === 'yamlToJson' ? 'YAML Input' : 'JSON Input'}
            </label>
            {input && <span className="text-xs text-slate-400">{input.length} chars</span>}
          </div>
          <textarea
            className="tool-textarea font-mono text-[13px]"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'yamlToJson' ? 'Paste YAML here...' : 'Paste JSON here...'}
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {mode === 'yamlToJson' ? 'JSON Output' : 'YAML Output'}
            </label>
            {output && (
              <button onClick={copy} className="btn-ghost text-xs">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            className="tool-textarea font-mono text-[13px] bg-slate-50 dark:bg-slate-900/50"
            value={output}
            readOnly
            placeholder="Output will appear here..."
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
