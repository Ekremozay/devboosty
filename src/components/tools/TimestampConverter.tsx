'use client';
// src/components/tools/TimestampConverter.tsx
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/useToast';

type ConvertMode = 'toHuman' | 'toUnix';

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Europe/London',
  'Europe/Paris',
  'Europe/Istanbul',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
];

function formatDateTime(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    }).format(date);
  } catch {
    return 'Invalid timezone';
  }
}

export default function TimestampConverter() {
  const [mode, setMode] = useState<ConvertMode>('toHuman');
  const [unixInput, setUnixInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [result, setResult] = useState<null | {
    unix: number;
    iso: string;
    utc: string;
    relative: string;
    formatted: string;
  }>(null);
  const [error, setError] = useState('');

  const now = Math.floor(Date.now() / 1000);

  const relativeTime = useCallback((unix: number): string => {
    const diff = Math.abs(Date.now() / 1000 - unix);
    const past = unix < Date.now() / 1000;
    const suffix = past ? 'ago' : 'from now';

    if (diff < 60) return `${Math.floor(diff)}s ${suffix}`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${suffix}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ${suffix}`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ${suffix}`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ${suffix}`;
    return `${Math.floor(diff / 31536000)}y ${suffix}`;
  }, []);

  const convertUnixToHuman = useCallback(() => {
    setError('');
    const raw = unixInput.trim();
    if (!raw) { setError('Enter a Unix timestamp'); return; }

    const unix = parseInt(raw, 10);
    if (isNaN(unix)) { setError('Invalid timestamp — must be an integer'); return; }

    // Handle milliseconds automatically
    const adjusted = raw.length >= 13 ? Math.floor(unix / 1000) : unix;
    const date = new Date(adjusted * 1000);

    setResult({
      unix: adjusted,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      relative: relativeTime(adjusted),
      formatted: formatDateTime(date, timezone),
    });
  }, [unixInput, timezone, relativeTime]);

  const convertHumanToUnix = useCallback(() => {
    setError('');
    const raw = dateInput.trim();
    if (!raw) { setError('Enter a date/time'); return; }

    const date = new Date(raw);
    if (isNaN(date.getTime())) { setError('Invalid date format. Try: 2024-01-15 or 2024-01-15T14:30:00Z'); return; }

    const unix = Math.floor(date.getTime() / 1000);
    setResult({
      unix,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      relative: relativeTime(unix),
      formatted: formatDateTime(date, timezone),
    });
  }, [dateInput, timezone, relativeTime]);

  const copyValue = (value: string, label: string) => {
    navigator.clipboard.writeText(value).then(() => {
      toast(`Copied ${label}!`);
    });
  };

  const ResultRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium w-32 flex-shrink-0">{label}</span>
      <span className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all flex-1">{value}</span>
      <button
        onClick={() => copyValue(value, label)}
        className="text-xs btn-ghost py-1 flex-shrink-0"
      >
        Copy
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Current timestamp */}
      <div className="bg-brand-50 dark:bg-brand-950 border border-brand-100 dark:border-brand-900 rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wide mb-1">Current Unix Timestamp</div>
          <div className="font-mono text-2xl font-bold text-brand-700 dark:text-brand-300">{now}</div>
        </div>
        <button onClick={() => { setUnixInput(String(now)); setMode('toHuman'); }} className="btn-ghost text-brand-600 dark:text-brand-400 text-sm">
          Use this →
        </button>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {([
          { key: 'toHuman', label: '🕐 Unix → Human' },
          { key: 'toUnix', label: '📅 Date → Unix' },
        ] as { key: ConvertMode; label: string }[]).map(m => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setResult(null); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              mode === m.key
                ? 'bg-brand-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timezone selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">Timezone:</label>
        <select
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>

      {/* Input */}
      {mode === 'toHuman' ? (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unix Timestamp</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={unixInput}
              onChange={e => setUnixInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && convertUnixToHuman()}
              placeholder="e.g. 1705276800 or 1705276800000"
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button onClick={convertUnixToHuman} className="btn-primary">Convert</button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">Accepts both seconds (10 digits) and milliseconds (13 digits)</p>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date / Time</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && convertHumanToUnix()}
              placeholder="e.g. 2024-01-15 or 2024-01-15T14:30:00Z"
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button onClick={convertHumanToUnix} className="btn-primary">Convert</button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">ISO 8601, RFC 2822, or any standard date format</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300">
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Results</h3>
          <div>
            <ResultRow label="Unix (sec)" value={String(result.unix)} />
            <ResultRow label="Unix (ms)" value={String(result.unix * 1000)} />
            <ResultRow label="ISO 8601" value={result.iso} />
            <ResultRow label="UTC" value={result.utc} />
            <ResultRow label="Relative" value={result.relative} />
            <ResultRow label={timezone} value={result.formatted} />
          </div>
        </div>
      )}
    </div>
  );
}
