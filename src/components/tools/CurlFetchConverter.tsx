'use client';

import { useMemo, useState } from 'react';

const CURL_SAMPLE = `curl -X POST "https://api.example.com/tools" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token" \\
  -d '{"name":"DevBoosty","category":"developer"}'`;

const FETCH_SAMPLE = `fetch("https://api.example.com/tools", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer token"
  },
  body: JSON.stringify({ name: "DevBoosty", category: "developer" })
});`;

function splitCurlTokens(input: string) {
  return input.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
}

function curlToFetch(input: string) {
  const tokens = splitCurlTokens(input);
  let url = '';
  let method = 'GET';
  let body = '';
  const headers: Record<string, string> = {};

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1]?.replace(/^"|"$/g, '');

    if (token === 'curl') continue;
    if (token === '-X' || token === '--request') method = next ?? method;
    if (token === '-H' || token === '--header') {
      const [key, ...rest] = (next ?? '').split(':');
      headers[key.trim()] = rest.join(':').trim();
    }
    if (token === '-d' || token === '--data' || token === '--data-raw') body = next ?? body;
    if (/^https?:\/\//.test(token.replace(/^"|"$/g, ''))) url = token.replace(/^"|"$/g, '');
  }

  const lines = [`fetch("${url}", {`, `  method: "${method.toUpperCase()}",`];

  if (Object.keys(headers).length) {
    lines.push('  headers: {');
    Object.entries(headers).forEach(([key, value]) => {
      lines.push(`    "${key}": "${value}",`);
    });
    lines.push('  },');
  }

  if (body) lines.push(`  body: ${body.startsWith('{') ? `JSON.stringify(${body})` : `"${body}"`},`);
  lines.push('});');

  return lines.join('\n');
}

function fetchToCurl(input: string) {
  const urlMatch = input.match(/fetch\(\s*["'`]([^"'`]+)["'`]/);
  const methodMatch = input.match(/method:\s*["'`]([^"'`]+)["'`]/);
  const bodyMatch = input.match(/body:\s*([^,\n}]+)/);
  const headerBlock = input.match(/headers:\s*\{([\s\S]*?)\}/);

  const parts = ['curl'];
  if (methodMatch?.[1]) parts.push(`-X ${methodMatch[1].toUpperCase()}`);
  if (urlMatch?.[1]) parts.push(`"${urlMatch[1]}"`);

  if (headerBlock?.[1]) {
    const headerMatches = Array.from(
      headerBlock[1].matchAll(/["'`]([^"'`]+)["'`]\s*:\s*["'`]([^"'`]+)["'`]/g),
    );
    headerMatches.forEach((match) => {
      parts.push(`-H "${match[1]}: ${match[2]}"`);
    });
  }

  if (bodyMatch?.[1]) {
    parts.push(`-d ${bodyMatch[1].trim()}`);
  }

  return parts.join(' \\\n  ');
}

export default function CurlFetchConverter() {
  const [mode, setMode] = useState<'curl-to-fetch' | 'fetch-to-curl'>('curl-to-fetch');
  const [input, setInput] = useState(CURL_SAMPLE);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    try {
      return mode === 'curl-to-fetch' ? curlToFetch(input) : fetchToCurl(input);
    } catch {
      return '';
    }
  }, [input, mode]);

  const switchMode = (nextMode: 'curl-to-fetch' | 'fetch-to-curl') => {
    setMode(nextMode);
    setInput(nextMode === 'curl-to-fetch' ? CURL_SAMPLE : FETCH_SAMPLE);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-[18px] bg-slate-100 p-1 dark:bg-slate-900/70">
        {([
          ['curl-to-fetch', 'cURL to fetch'],
          ['fetch-to-curl', 'fetch to cURL'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => switchMode(value)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
              mode === value
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Input</p>
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
