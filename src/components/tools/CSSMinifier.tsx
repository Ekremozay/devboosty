'use client';
// src/components/tools/CSSMinifier.tsx
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/useToast';

const SAMPLE_CSS = `/* Navigation styles */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.navbar .logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0ea5e9;
  text-decoration: none;
}

/* Button styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-primary {
  background-color: #0ea5e9;
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  background-color: #0284c7;
}`;

function minifyCSS(css: string): { result: string; savings: number } {
  const original = css;

  let result = css
    // Remove CSS comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around selectors and declarations
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove whitespace around media query operators
    .replace(/\s*([@!])\s*/g, '$1')
    // Collapse multiple whitespace into single space
    .replace(/\s+/g, ' ')
    // Remove space after opening brace
    .replace(/\{\s*/g, '{')
    // Remove space before closing brace
    .replace(/\s*\}/g, '}')
    // Remove last semicolon before closing brace
    .replace(/;}/g, '}')
    // Remove leading/trailing whitespace
    .trim();

  const savings = original.length > 0
    ? Math.round(((original.length - result.length) / original.length) * 100)
    : 0;

  return { result, savings };
}

export default function CSSMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [savings, setSavings] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    const { result, savings: s } = minifyCSS(input);
    setOutput(result);
    setSavings(s);
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
    setInput(SAMPLE_CSS);
    setOutput('');
    setSavings(0);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setSavings(0);
  };

  return (
    <div className="space-y-5">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleMinify} className="btn-primary" disabled={!input.trim()}>
          ⚡ Minify CSS
        </button>
        <button onClick={handleLoadSample} className="btn-ghost">Load Sample</button>
        <button onClick={handleClear} className="btn-ghost">Clear</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Input CSS</label>
            {input && (
              <span className="text-xs text-slate-400">{input.length} chars</span>
            )}
          </div>
          <textarea
            className="tool-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste your CSS here..."
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Minified CSS</label>
            {output && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {savings}% smaller ({output.length} chars)
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
            placeholder="Minified CSS will appear here..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Stats */}
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
            <div className="text-xs text-amber-500 dark:text-amber-400">Size reduction</div>
          </div>
        </div>
      )}
    </div>
  );
}
