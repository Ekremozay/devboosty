'use client';

import { useState } from 'react';

const SAMPLE_SVG = `<svg width="320" height="160" viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
  <metadata>Generated for DevBoosty</metadata>
  <defs></defs>
  <g fill="none" fill-rule="evenodd">
    <rect x="12" y="12" width="296" height="136" rx="24" fill="#F8FAFC" stroke="#CBD5E1"/>
    <circle cx="84" cy="80" r="34" fill="#F97316"/>
    <path d="M150 45h96v18h-96zM150 74h120v14H150zM150 102h82v14h-82z" fill="#0F172A"/>
  </g>
</svg>`;

function optimizeSvg(input: string) {
  return input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
    .replace(/<desc[\s\S]*?<\/desc>/g, '')
    .replace(/<defs>\s*<\/defs>/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function formatSvg(input: string) {
  return input.replace(/></g, '>\n<');
}

export default function SVGOptimizer() {
  const [input, setInput] = useState(SAMPLE_SVG);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const optimize = () => setOutput(optimizeSvg(input));
  const prettify = () => setOutput(formatSvg(input));

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={optimize} className="btn-primary px-4 py-2.5 text-sm">Optimize SVG</button>
        <button type="button" onClick={prettify} className="btn-secondary px-4 py-2.5 text-sm">Format SVG</button>
        <button type="button" onClick={() => setInput(SAMPLE_SVG)} className="btn-ghost rounded-[18px] border border-slate-200 px-4 py-2.5 text-xs dark:border-slate-800">Load sample</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Input SVG</p>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="tool-textarea font-mono text-[13px] leading-6"
            style={{ minHeight: 320 }}
            spellCheck={false}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Output</p>
            <button type="button" onClick={copy} className="btn-secondary px-4 py-2 text-xs" disabled={!output}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 320 }}
          />
        </div>
      </div>
    </div>
  );
}
