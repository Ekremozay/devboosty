'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

function bytesToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

async function createHash(algorithm: HashAlgorithm, value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest(algorithm, encoded);
  return bytesToHex(digest);
}

async function createHmac(algorithm: HashAlgorithm, key: string, value: string) {
  const encodedKey = new TextEncoder().encode(key);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encodedKey,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(value));
  return bytesToHex(signature);
}

export default function HashToolkit() {
  const pathname = usePathname();
  const hmacMode = pathname?.includes('hmac-generator');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [input, setInput] = useState('DevBoosty developer tools');
  const [secret, setSecret] = useState('workspace-secret');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!input.trim()) {
        setOutput('');
        return;
      }

      const result = hmacMode
        ? await createHmac(algorithm, secret, input)
        : await createHash(algorithm, input);

      setOutput(result);
    };

    void run();
  }, [algorithm, hmacMode, input, secret]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-slate-200 bg-white/70 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
        {hmacMode ? 'Generate keyed HMAC signatures for API authentication and request signing.' : 'Generate browser-side hashes for quick verification and integrity checks.'}
      </div>

      <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Algorithm</label>
          <select
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)}
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {(['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as HashAlgorithm[]).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">{hmacMode ? 'Message' : 'Input'}</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="tool-textarea font-mono text-[13px] leading-6"
            style={{ minHeight: 220 }}
            spellCheck={false}
          />
        </div>
      </div>

      {hmacMode && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Secret key</label>
          <input
            type="text"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{hmacMode ? 'HMAC output' : 'Hash output'}</p>
          <button type="button" onClick={copy} className="btn-secondary px-4 py-2 text-xs" disabled={!output}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <textarea
          value={output}
          readOnly
          className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
          style={{ minHeight: 160 }}
        />
      </div>
    </div>
  );
}
