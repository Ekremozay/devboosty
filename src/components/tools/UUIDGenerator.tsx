'use client';
// src/components/tools/UUIDGenerator.tsx

import { useState } from 'react';

function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generate = () => {
    const results = Array.from({ length: count }, () => {
      let uuid = generateUUIDv4();
      if (!hyphens) uuid = uuid.replace(/-/g, '');
      if (uppercase) uuid = uuid.toUpperCase();
      return uuid;
    });
    setUuids(results);
    setCopied(null);
  };

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n')).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    });
  };

  return (
    <div className="space-y-5">
      {/* Options */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Count slider */}
          <div className="sm:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Count: <span className="text-brand-600 dark:text-brand-400">{count}</span>
            </label>
            <input
              type="range" min={1} max={100} value={count}
              onChange={e => setCount(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>1</span><span>100</span></div>
          </div>

          {/* Toggles */}
          <div className="sm:col-span-2 flex flex-col gap-3 justify-center">
            {[
              { label: 'Uppercase (A–F instead of a–f)', value: uppercase, set: setUppercase },
              { label: 'Include hyphens (xxxxxxxx-xxxx-...)', value: hyphens, set: setHyphens },
            ].map(({ label, value, set }) => (
              <div key={label} className="flex items-center gap-3">
                <button
                  onClick={() => set(!value)}
                  className={`w-10 h-5 rounded-full transition-colors shrink-0 ${value ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow mx-0.5 transition-transform ${value ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={generate} className="btn-primary w-full justify-center py-3 text-base">
        ⚡ Generate UUID{count > 1 ? 's' : ''}
      </button>

      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3">
              <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-100 select-all break-all">
                {uuid}
              </code>
              <button onClick={() => copy(uuid, i)} className="btn-secondary shrink-0 text-xs px-3 py-1.5">
                {copied === i ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
          <button onClick={copyAll} className="btn-secondary w-full justify-center text-xs">
            {copiedAll ? '✓ Copied All!' : `Copy All ${uuids.length} UUIDs`}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-brand-50 dark:bg-brand-950/30 rounded-xl p-4 text-sm text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-900">
        <strong>UUID v4</strong> uses 122 random bits. The probability of two identical UUIDs is so low it can be considered impossible for any practical application.
      </div>
    </div>
  );
}
