'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

type ThemeMode = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'devboosty-theme-mode';

function resolveAutoTheme() {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<ThemeMode>('auto');

  useEffect(() => {
    setMounted(true);

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'auto' || stored === 'light' || stored === 'dark') {
        setMode(stored);
      }
    } catch {
      setMode('auto');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const applyTheme = () => {
      setTheme(mode === 'auto' ? resolveAutoTheme() : mode);
    };

    applyTheme();

    if (mode !== 'auto') return;

    const timer = window.setInterval(applyTheme, 60 * 1000);
    return () => window.clearInterval(timer);
  }, [mode, mounted, setTheme]);

  const updateMode = (nextMode: ThemeMode) => {
    setMode(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
  };

  if (!mounted) {
    return <div className="h-12 w-[184px]" />;
  }

  return (
    <div className="flex h-12 items-center rounded-[20px] border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950/70">
      {([
        ['auto', 'Auto'],
        ['light', 'Light'],
        ['dark', 'Dark'],
      ] as const).map(([value, label]) => {
        const active = mode === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => updateMode(value)}
            className={`rounded-[16px] px-3 py-2 text-xs font-semibold transition-colors ${
              active
                ? 'bg-brand-50 text-brand-800 dark:bg-brand-500/10 dark:text-brand-200'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            aria-label={`Switch theme mode to ${label}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
