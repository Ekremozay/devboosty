'use client';

import { useMemo, useState } from 'react';

export default function CSSGradientGenerator() {
  const [angle, setAngle] = useState(135);
  const [start, setStart] = useState('#F97316');
  const [middle, setMiddle] = useState('#F59E0B');
  const [end, setEnd] = useState('#14B8A6');
  const [copied, setCopied] = useState(false);

  const css = useMemo(
    () => `linear-gradient(${angle}deg, ${start} 0%, ${middle} 52%, ${end} 100%)`,
    [angle, end, middle, start],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(css);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          {[
            ['Start', start, setStart],
            ['Middle', middle, setMiddle],
            ['End', end, setEnd],
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

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Angle</label>
              <span className="text-sm text-slate-400 dark:text-slate-500">{angle}deg</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(event) => setAngle(Number(event.target.value))}
              className="mt-3 w-full accent-brand-500"
            />
          </div>

          <button type="button" onClick={copy} className="btn-primary w-full">
            {copied ? 'Copied gradient' : 'Copy CSS gradient'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="h-[320px] rounded-[28px] border border-slate-200 shadow-sm dark:border-slate-800" style={{ background: css }} />
          <textarea
            value={`background: ${css};`}
            readOnly
            className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 120 }}
          />
        </div>
      </div>
    </div>
  );
}
