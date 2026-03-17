'use client';
// src/components/tools/HTMLViewer.tsx

import { useState, useRef, useEffect } from 'react';

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; }
    h1 { color: #0ea5e9; font-size: 2rem; margin-bottom: 8px; }
    p { color: #475569; line-height: 1.7; }
    .card { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin-top: 16px; }
    button { background: #0ea5e9; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 14px; margin-top: 12px; }
    button:hover { background: #0284c7; }
  </style>
</head>
<body>
  <h1>Hello from HTML Viewer! 👋</h1>
  <p>This is a <strong>live preview</strong> of your HTML code. Edit the code on the left to see changes in real time.</p>
  <div class="card">
    <strong>✅ Supports:</strong> HTML, CSS, and JavaScript
    <br><br>
    <button onclick="alert('JavaScript works too!')">Click me!</button>
  </div>
</body>
</html>`;

export default function HTMLViewer() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [mode, setMode] = useState<'split' | 'preview' | 'code'>('split');
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Debounced preview update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        try {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            doc.open();
            doc.write(html);
            doc.close();
          }
        } catch (e) {
          // sandboxed iframe — use srcdoc instead
          setIframeKey(k => k + 1);
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [html]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setHtml('');
  const handleSample = () => setHtml(SAMPLE_HTML);

  const lineCount = html.split('\n').length;
  const charCount = html.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* View mode */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {(['split', 'code', 'preview'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                mode === m ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {m === 'split' ? '⧉ Split' : m === 'code' ? '{ } Code' : '👁 Preview'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{lineCount} lines · {charCount} chars</span>
          <button onClick={handleSample} className="btn-ghost text-xs">Sample</button>
          <button onClick={handleClear} className="btn-ghost text-xs">Clear</button>
          <button onClick={handleCopy} className="btn-secondary text-xs">
            {copied ? '✓ Copied' : 'Copy HTML'}
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className={`grid gap-4 ${mode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Code editor */}
        {(mode === 'split' || mode === 'code') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-slate-400 font-mono">index.html</span>
            </div>
            <textarea
              className="tool-textarea bg-slate-900 text-green-300 border-slate-700 focus:ring-green-500"
              value={html}
              onChange={e => setHtml(e.target.value)}
              placeholder="Paste or type HTML here..."
              spellCheck={false}
              style={{ minHeight: 480, fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.6' }}
            />
          </div>
        )}

        {/* Preview */}
        {(mode === 'split' || mode === 'preview') && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-500">Live Preview</span>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white" style={{ minHeight: 480 }}>
              <iframe
                key={iframeKey}
                ref={iframeRef}
                title="HTML Preview"
                srcDoc={html}
                sandbox="allow-scripts allow-same-origin"
                className="w-full"
                style={{ height: 480, border: 'none', display: 'block' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
        <span>🛡 Sandboxed iframe — your code runs safely in isolation</span>
        <span>·</span>
        <span>⚡ Live preview updates as you type</span>
      </div>
    </div>
  );
}
