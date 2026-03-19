'use client';

import { useState, useCallback } from 'react';

interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every day at 9 AM', value: '0 9 * * *' },
  { label: 'Every Monday at 9 AM', value: '0 9 * * 1' },
  { label: 'Every weekday at 9 AM', value: '0 9 * * 1-5' },
  { label: 'Every Sunday midnight', value: '0 0 * * 0' },
  { label: '1st of every month', value: '0 0 1 * *' },
  { label: 'Every year on Jan 1', value: '0 0 1 1 *' },
  { label: 'Twice a day', value: '0 0,12 * * *' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
];

function parsePart(part: string, min: number, max: number, names?: string[]): string {
  if (part === '*') return 'every ' + (names ? names[0]?.toLowerCase().replace(/y$/, 'y') : 'value');
  if (part.startsWith('*/')) {
    const step = parseInt(part.slice(2));
    return `every ${step} ${names ? names[0]?.toLowerCase().replace(/y$/, 'ies').replace(/s$/, 's') + 's' : 'values'}`;
  }
  if (part.includes('-')) {
    const [s, e] = part.split('-');
    const start = names ? (names[parseInt(s)] ?? s) : s;
    const end = names ? (names[parseInt(e)] ?? e) : e;
    return `from ${start} to ${end}`;
  }
  if (part.includes(',')) {
    const values = part.split(',').map(v => names ? (names[parseInt(v)] ?? v) : v);
    return values.slice(0, -1).join(', ') + ' and ' + values[values.length - 1];
  }
  const n = parseInt(part);
  if (!isNaN(n) && names) return names[n] ?? part;
  return part;
}

function describeCron(expr: string): { description: string; parts: CronParts } | { error: string } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return { error: 'A cron expression must have exactly 5 fields: minute hour day-of-month month day-of-week' };

  const [minute, hour, dom, month, dow] = parts;

  try {
    const minuteDesc = parsePart(minute, 0, 59);
    const hourDesc = parsePart(hour, 0, 23);
    const domDesc = parsePart(dom, 1, 31);
    const monthDesc = parsePart(month, 1, 12, MONTHS);
    const dowDesc = parsePart(dow, 0, 6, DAYS);

    const lines: string[] = [];

    if (minute === '*' && hour === '*') lines.push('Every minute');
    else if (minute.startsWith('*/') && hour === '*') lines.push(`Every ${minute.slice(2)} minutes`);
    else if (minute === '0' && hour === '*') lines.push('At the start of every hour');
    else {
      const h = parseInt(hour);
      const m = parseInt(minute);
      if (!isNaN(h) && !isNaN(m)) {
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        lines.push(`At ${time}`);
      } else if (!hour.includes('*') && !hour.includes('/') && !hour.includes(',') && !hour.includes('-')) {
        lines.push(`At minute ${minuteDesc} past hour ${hourDesc}`);
      } else {
        lines.push(`At minute ${minuteDesc}, ${hourDesc}`);
      }
    }

    if (dow !== '*') lines.push(`on ${dowDesc}`);
    else if (dom !== '*') lines.push(`on the ${domDesc} of the month`);

    if (month !== '*') lines.push(`in ${monthDesc}`);

    return {
      description: lines.join(', '),
      parts: { minute, hour, dayOfMonth: dom, month, dayOfWeek: dow },
    };
  } catch {
    return { error: 'Could not parse this cron expression.' };
  }
}

function getNextRuns(expr: string, count = 5): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const [minute, hour, , , dow] = parts;
  const results: string[] = [];
  const now = new Date();
  const candidate = new Date(now);
  candidate.setSeconds(0, 0);
  candidate.setMinutes(candidate.getMinutes() + 1);

  let iterations = 0;
  while (results.length < count && iterations < 525600) {
    iterations++;
    const m = candidate.getMinutes();
    const h = candidate.getHours();
    const d = candidate.getDay();

    const minuteMatch = minute === '*' || (minute.startsWith('*/') ? m % parseInt(minute.slice(2)) === 0 : minute.split(',').includes(String(m)));
    const hourMatch = hour === '*' || (hour.startsWith('*/') ? h % parseInt(hour.slice(2)) === 0 : hour.split(',').includes(String(h)));
    const dowMatch = dow === '*' || dow.split(',').some(v => {
      if (v.includes('-')) {
        const [s, e] = v.split('-').map(Number);
        return d >= s && d <= e;
      }
      return parseInt(v) === d;
    });

    if (minuteMatch && hourMatch && dowMatch) {
      results.push(candidate.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    }
    candidate.setMinutes(candidate.getMinutes() + 1);
  }
  return results;
}

export default function CronParser() {
  const [expr, setExpr] = useState('0 9 * * 1');
  const [result, setResult] = useState<ReturnType<typeof describeCron> | null>(null);
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [copied, setCopied] = useState('');

  const parse = useCallback(() => {
    const r = describeCron(expr);
    setResult(r);
    if (!('error' in r)) setNextRuns(getNextRuns(expr));
    else setNextRuns([]);
  }, [expr]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 1800);
    });
  };

  const FIELD_LABELS = [
    { key: 'minute', label: 'Minute', range: '0-59' },
    { key: 'hour', label: 'Hour', range: '0-23' },
    { key: 'dayOfMonth', label: 'Day (month)', range: '1-31' },
    { key: 'month', label: 'Month', range: '1-12' },
    { key: 'dayOfWeek', label: 'Day (week)', range: '0-6' },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        Parse cron expressions into plain English. See the next scheduled run times and browse common presets.
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={expr}
          onChange={e => setExpr(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && parse()}
          placeholder="e.g. 0 9 * * 1"
          className="flex-1 rounded-[18px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 text-sm font-mono outline-none focus:border-brand-300"
        />
        <button onClick={parse} className="btn-primary">Parse</button>
        <button onClick={() => copy(expr, 'expr')} className="btn-ghost">{copied === 'expr' ? '✓' : 'Copy'}</button>
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 mb-2">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.value} onClick={() => { setExpr(p.value); setResult(null); setNextRuns([]); }}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${expr === p.value ? 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <>
          {'error' in result ? (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">⚠ {result.error}</div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-[24px] border border-brand-200 bg-brand-50 p-5 dark:border-brand-500/30 dark:bg-brand-500/10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400 mb-2">Description</p>
                <p className="text-lg font-semibold text-brand-900 dark:text-brand-100">{result.description}</p>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {FIELD_LABELS.map(({ key, label, range }) => (
                  <div key={key} className="rounded-[18px] border border-slate-200 bg-white/80 p-3 text-center dark:border-slate-700 dark:bg-slate-900/60">
                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">{result.parts[key]}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{range}</p>
                  </div>
                ))}
              </div>

              {nextRuns.length > 0 && (
                <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Next 5 scheduled runs</p>
                  <div className="space-y-2">
                    {nextRuns.map((run, i) => (
                      <div key={i} className="flex items-center justify-between rounded-[14px] bg-slate-50 dark:bg-slate-900/60 px-3 py-2">
                        <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{run}</span>
                        <button onClick={() => copy(run, `run-${i}`)} className="btn-ghost text-xs py-1 px-2">{copied === `run-${i}` ? '✓' : 'Copy'}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[20px] p-4 text-xs text-slate-500 dark:text-slate-400">
        <strong className="text-slate-700 dark:text-slate-300">Format:</strong>{' '}
        <span className="font-mono">minute (0-59)  ·  hour (0-23)  ·  day-of-month (1-31)  ·  month (1-12)  ·  day-of-week (0-6, Sun=0)</span>
        <br />
        <span className="mt-1 block"><strong className="text-slate-700 dark:text-slate-300">Special chars:</strong> <span className="font-mono">* = every  ·  */n = every n  ·  a-b = range  ·  a,b = list</span></span>
      </div>
    </div>
  );
}
