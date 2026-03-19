'use client';

import { useState } from 'react';

type FormatterLanguage = 'html' | 'css' | 'javascript';

const SAMPLES: Record<FormatterLanguage, string> = {
  html: '<section><div class="card"><h2>Developer Hub</h2><p>Format snippets and move faster.</p></div></section>',
  css: '.card{display:grid;gap:12px;padding:24px;border:1px solid #e2e8f0;background:#fff;border-radius:18px}.card h2{font-size:1.5rem;margin:0}',
  javascript: 'async function loadTools(){const response=await fetch("/api/tools");if(!response.ok){throw new Error("Failed")}return response.json();}',
};

function formatHTML(input: string, indent = 2) {
  const tab = ' '.repeat(indent);
  let level = 0;
  let result = '';
  const tokens = input.replace(/>\s+</g, '><').trim().split(/(<[^>]+>)/g);

  for (const token of tokens) {
    if (!token.trim()) continue;

    if (/^<\//.test(token)) {
      level = Math.max(0, level - 1);
      result += `${tab.repeat(level)}${token}\n`;
      continue;
    }

    if (/^<[^/!][^>]*[^/]?>$/.test(token) && !/\/>$/.test(token)) {
      result += `${tab.repeat(level)}${token}\n`;
      level += 1;
      continue;
    }

    result += `${tab.repeat(level)}${token}\n`;
  }

  return result.trim();
}

function formatCSS(input: string, indent = 2) {
  const tab = ' '.repeat(indent);
  let level = 0;
  let result = '';

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (char === '{') {
      result = `${result.trimEnd()} {\n`;
      level += 1;
      result += tab.repeat(level);
      continue;
    }

    if (char === '}') {
      level = Math.max(0, level - 1);
      result = `${result.trimEnd()}\n${tab.repeat(level)}}\n${tab.repeat(level)}`;
      continue;
    }

    if (char === ';') {
      result = `${result.trimEnd()};\n${tab.repeat(level)}`;
      continue;
    }

    if (char === ',') {
      result += ', ';
      continue;
    }

    result += char;
  }

  return result
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

function formatJavaScript(input: string, indent = 2) {
  const tab = ' '.repeat(indent);
  let level = 0;
  let result = '';
  let inString = false;
  let currentQuote = '';

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const previous = input[index - 1];

    if ((char === '"' || char === '\'' || char === '`') && previous !== '\\') {
      if (inString && currentQuote === char) {
        inString = false;
        currentQuote = '';
      } else if (!inString) {
        inString = true;
        currentQuote = char;
      }
      result += char;
      continue;
    }

    if (inString) {
      result += char;
      continue;
    }

    if (char === '{') {
      result = `${result.trimEnd()} {\n`;
      level += 1;
      result += tab.repeat(level);
      continue;
    }

    if (char === '}') {
      level = Math.max(0, level - 1);
      result = `${result.trimEnd()}\n${tab.repeat(level)}}`;

      const next = input[index + 1];
      if (next && next !== ';' && next !== ',' && next !== ')') {
        result += `\n${tab.repeat(level)}`;
      }
      continue;
    }

    if (char === ';') {
      result = `${result.trimEnd()};\n${tab.repeat(level)}`;
      continue;
    }

    if (char === ',') {
      result += ', ';
      continue;
    }

    result += char;
  }

  return result
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

function formatSource(language: FormatterLanguage, input: string) {
  if (language === 'html') return formatHTML(input);
  if (language === 'css') return formatCSS(input);
  return formatJavaScript(input);
}

export default function CodeFormatter() {
  const [language, setLanguage] = useState<FormatterLanguage>('html');
  const [input, setInput] = useState(SAMPLES.html);
  const [output, setOutput] = useState(formatSource('html', SAMPLES.html));
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (nextLanguage: FormatterLanguage) => {
    setLanguage(nextLanguage);
    setInput(SAMPLES[nextLanguage]);
    setOutput(formatSource(nextLanguage, SAMPLES[nextLanguage]));
  };

  const handleFormat = () => {
    setOutput(formatSource(language, input));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-slate-200 bg-white/70 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
        Quick formatter for HTML, CSS, and JavaScript snippets. Best for browser-side cleanup and readability, not full AST-level refactoring.
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-[18px] bg-slate-100 p-1 dark:bg-slate-900/70">
          {(['html', 'css', 'javascript'] as FormatterLanguage[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleLanguageChange(value)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                language === value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {value === 'javascript' ? 'JavaScript' : value.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setInput(SAMPLES[language])} className="btn-secondary px-4 py-2 text-xs">
            Load sample
          </button>
          <button type="button" onClick={() => setInput('')} className="btn-ghost rounded-[18px] border border-slate-200 px-4 py-2 text-xs dark:border-slate-800">
            Clear
          </button>
          <button type="button" onClick={handleCopy} className="btn-primary px-4 py-2 text-xs">
            {copied ? 'Copied' : 'Copy output'}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Input</p>
            <button type="button" onClick={handleFormat} className="btn-secondary px-4 py-2 text-xs">
              Format now
            </button>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            className="tool-textarea font-mono text-[13px] leading-6"
            style={{ minHeight: 360 }}
            placeholder="Paste your code here"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Formatted output</p>
          <textarea
            value={output}
            readOnly
            spellCheck={false}
            className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 360 }}
            placeholder="Formatted code appears here"
          />
        </div>
      </div>
    </div>
  );
}
