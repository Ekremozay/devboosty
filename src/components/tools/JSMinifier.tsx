'use client';
// src/components/tools/JSMinifier.tsx
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/useToast';

const SAMPLE_JS = `// Utility functions for a web application
function formatDate(date, locale = 'en-US') {
  /* Format a date object to a readable string */
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};`;

function minifyJS(js: string): { result: string; savings: number } {
  const original = js;

  let result = js
    // Remove single-line comments (but not URLs like http://)
    .replace(/(?<![:"'])\/\/(?!\/)[^\n]*/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove leading/trailing whitespace from lines
    .replace(/^[ \t]+/gm, '')
    .replace(/[ \t]+$/gm, '')
    // Collapse multiple newlines
    .replace(/\n{2,}/g, '\n')
    // Collapse spaces around operators (careful not to break strings)
    .replace(/[ \t]*([=+\-*/<>!&|,;:{}()\[\]])[ \t]*/g, '$1')
    // Remove space after keywords before (
    .replace(/\b(if|for|while|switch|catch|function)\(/g, '$1(')
    // Collapse multiple spaces
    .replace(/ {2,}/g, ' ')
    // Remove blank lines
    .replace(/^\n/gm, '')
    .trim();

  const savings = original.length > 0
    ? Math.round(((original.length - result.length) / original.length) * 100)
    : 0;

  return { result, savings };
}

export default function JSMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [savings, setSavings] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    setError('');
    try {
      const { result, savings: s } = minifyJS(input);
      setOutput(result);
      setSavings(s);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [input]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      toast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const handleLoadSample = () => {
    setInput(SAMPLE_JS);
    setOutput('');
    setSavings(0);
    setError('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setSavings(0);
    setError('');
  };

  return (
    <div className="space-y-5">
      {/* Note */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
        <strong>ℹ Basic minifier:</strong> Removes comments and excess whitespace. For production, use a build tool like webpack, esbuild, or Vite which apply advanced optimizations.
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleMinify} className="btn-primary" disabled={!input.trim()}>
          ⚡ Minify JS
        </button>
        <button onClick={handleLoadSample} className="btn-ghost">Load Sample</button>
        <button onClick={handleClear} className="btn-ghost">Clear</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input JavaScript</label>
            {input && <span className="text-xs text-slate-400">{input.length} chars</span>}
          </div>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your JavaScript here..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Minified JavaScript</label>
            {output && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {savings}% smaller
                </span>
                <button onClick={handleCopy} className="btn-ghost text-xs">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>
          <textarea
            className="tool-textarea"
            value={output}
            readOnly
            placeholder="Minified code will appear here..."
            spellCheck={false}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300">
          ⚠ {error}
        </div>
      )}

      {output && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 dark:bg-blue-950 rounded-xl p-3 text-center">
            <div className="font-bold text-blue-700 dark:text-blue-300 text-lg">{input.length}</div>
            <div className="text-xs text-blue-500 dark:text-blue-400">Original size</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950 rounded-xl p-3 text-center">
            <div className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">{output.length}</div>
            <div className="text-xs text-emerald-500 dark:text-emerald-400">Minified size</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950 rounded-xl p-3 text-center">
            <div className="font-bold text-amber-700 dark:text-amber-300 text-lg">{savings}%</div>
            <div className="text-xs text-amber-500 dark:text-amber-400">Reduced by</div>
          </div>
        </div>
      )}
    </div>
  );
}
