'use client';

import { useState, useCallback } from 'react';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>Clean Code</title><author>Robert C. Martin</author><year>2008</year><price>35.99</price></book><book id="2"><title>The Pragmatic Programmer</title><author>Andrew Hunt</author><year>1999</year><price>42.00</price></book></catalog>`;

function formatXML(xml: string, indent = 2): string {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', parseAttributeValue: true });
  const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: '@_', format: true, indentBy: ' '.repeat(indent), suppressEmptyNode: true });
  const parsed = parser.parse(xml);
  return builder.build(parsed);
}

function minifyXML(xml: string): string {
  return xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
}

export default function XMLFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const process = useCallback(() => {
    if (!input.trim()) { setError('Please enter XML to process.'); return; }
    setError('');
    try {
      const result = mode === 'format' ? formatXML(input, indent) : minifyXML(input);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid XML.');
    }
  }, [input, indent, mode]);

  const copy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const savings = input.length > 0 && output.length > 0
    ? Math.round(((input.length - output.length) / input.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        Format or minify XML. Pretty-prints with configurable indentation and validates structure.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {(['format', 'minify'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-2 text-sm font-semibold capitalize transition-colors ${mode === m ? 'bg-brand-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
              {m}
            </button>
          ))}
        </div>
        {mode === 'format' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600 dark:text-slate-400">Indent:</label>
            <select value={indent} onChange={e => setIndent(Number(e.target.value))}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1.5 text-sm">
              {[2, 4].map(n => <option key={n} value={n}>{n} spaces</option>)}
            </select>
          </div>
        )}
        <button onClick={process} className="btn-primary" disabled={!input.trim()}>
          {mode === 'format' ? '✨ Format' : '⚡ Minify'}
        </button>
        <button onClick={() => { setInput(SAMPLE_XML); setOutput(''); setError(''); }} className="btn-ghost">Sample</button>
        <button onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost">Clear</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">XML Input</label>
            {input && <span className="text-xs text-slate-400">{input.length} chars</span>}
          </div>
          <textarea className="tool-textarea font-mono text-[13px]" value={input} onChange={e => setInput(e.target.value)} placeholder="Paste XML here..." spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Output</label>
            {output && (
              <div className="flex items-center gap-3">
                {mode === 'minify' && savings > 0 && <span className="text-xs text-emerald-600 dark:text-emerald-400">{savings}% smaller</span>}
                <button onClick={copy} className="btn-ghost text-xs">{copied ? '✓ Copied' : 'Copy'}</button>
              </div>
            )}
          </div>
          <textarea className="tool-textarea font-mono text-[13px] bg-slate-50 dark:bg-slate-900/50" value={output} readOnly placeholder="Formatted XML will appear here..." spellCheck={false} />
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
