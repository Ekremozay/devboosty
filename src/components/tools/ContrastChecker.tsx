'use client';

import { useMemo, useState } from 'react';

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((value) => value + value).join('')
    : normalized;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const values = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function contrastRatio(foreground: string, background: string) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

export default function ContrastChecker() {
  const [foreground, setForeground] = useState('#0F172A');
  const [background, setBackground] = useState('#F8FAFC');

  const ratio = useMemo(() => contrastRatio(foreground, background), [background, foreground]);
  const rounded = ratio.toFixed(2);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3;
  const aaaNormal = ratio >= 7;
  const aaaLarge = ratio >= 4.5;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          {[
            ['Foreground', foreground, setForeground],
            ['Background', background, setBackground],
          ].map(([label, value, setter]) => (
            <div key={label as string}>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">{label as string}</label>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="color"
                  value={value as string}
                  onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                  className="h-12 w-16 rounded-xl border-0 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={value as string}
                  onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                  className="flex-1 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          ))}

          <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">Contrast ratio</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{rounded}:1</p>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-[28px] border border-slate-200 p-8 shadow-sm dark:border-slate-800"
            style={{ backgroundColor: background, color: foreground }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-70">Preview</p>
            <h2 className="mt-4 font-display text-4xl font-bold">Accessible design starts here.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 opacity-80">
              Use this preview to test body text, large headings, and UI contrast before shipping a palette into production.
            </p>
            <button
              type="button"
              className="mt-6 rounded-full border px-5 py-3 text-sm font-semibold"
              style={{ borderColor: foreground, color: foreground }}
            >
              Primary action
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['AA normal', aaNormal],
              ['AA large', aaLarge],
              ['AAA normal', aaaNormal],
              ['AAA large', aaaLarge],
            ].map(([label, pass]) => (
              <div key={label as string} className="rounded-[20px] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label as string}</p>
                <p className={`mt-2 text-lg font-bold ${pass ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
                  {pass ? 'Pass' : 'Fail'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
