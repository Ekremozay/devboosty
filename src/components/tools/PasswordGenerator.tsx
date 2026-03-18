'use client';
// src/components/tools/PasswordGenerator.tsx

import { useState, useCallback } from 'react';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length: number, opts: { upper: boolean; lower: boolean; digits: boolean; symbols: boolean }): string {
  let charset = '';
  if (opts.upper) charset += CHARS.upper;
  if (opts.lower) charset += CHARS.lower;
  if (opts.digits) charset += CHARS.digits;
  if (opts.symbols) charset += CHARS.symbols;
  if (!charset) return '';

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => charset[v % charset.length]).join('');
}

function strengthLabel(pwd: string): { label: string; color: string; width: string } {
  if (!pwd) return { label: '', color: 'bg-slate-200', width: 'w-0' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
  if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' };
  if (score <= 5) return { label: 'Strong', color: 'bg-brand-500', width: 'w-3/4' };
  return { label: 'Very Strong', color: 'bg-accent', width: 'w-full' };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [count, setCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const results = Array.from({ length: count }, () => generatePassword(length, opts));
    setPasswords(results);
    setCopied(null);
  }, [length, count, opts]);

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const toggle = (key: keyof typeof opts) => {
    const next = { ...opts, [key]: !opts[key] };
    if (!Object.values(next).some(Boolean)) return; // at least one required
    setOpts(next);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
        {/* Length */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Length: <span className="text-brand-600 dark:text-brand-400">{length}</span>
          </label>
          <input
            type="range" min={6} max={128} value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>6</span><span>128</span>
          </div>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Generate: <span className="text-brand-600 dark:text-brand-400">{count}</span> password{count > 1 ? 's' : ''}
          </label>
          <input
            type="range" min={1} max={20} value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1</span><span>20</span>
          </div>
        </div>

        {/* Character options */}
        <div className="sm:col-span-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Include:</p>
          <div className="flex flex-wrap gap-3">
            {([
              { key: 'upper', label: 'A–Z Uppercase' },
              { key: 'lower', label: 'a–z Lowercase' },
              { key: 'digits', label: '0–9 Digits' },
              { key: 'symbols', label: '!@# Symbols' },
            ] as { key: keyof typeof opts; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  opts[key]
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-brand-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button onClick={generate} className="btn-primary w-full justify-center py-3 text-base">
        ⚡ Generate Passwords
      </button>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="space-y-3">
          {passwords.map((pwd, i) => {
            const strength = strengthLabel(pwd);
            return (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
                <div className="flex items-center gap-3">
                  <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-100 break-all select-all">
                    {pwd}
                  </code>
                  <button
                    onClick={() => copy(pwd, i)}
                    className="btn-secondary shrink-0 text-xs px-3 py-1.5"
                  >
                    {copied === i ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                {/* Strength bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Strength</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                </div>
              </div>
            );
          })}
          <button
            onClick={() => navigator.clipboard.writeText(passwords.join('\n'))}
            className="btn-secondary w-full justify-center text-xs"
          >
            Copy All Passwords
          </button>
        </div>
      )}
    </div>
  );
}
