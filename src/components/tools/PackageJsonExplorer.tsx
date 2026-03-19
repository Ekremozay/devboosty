'use client';

import { useMemo, useState } from 'react';

const SAMPLE_PACKAGE_JSON = `{
  "name": "developer-hub",
  "version": "1.0.0",
  "packageManager": "pnpm@10.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "@types/node": "^20.0.0"
  }
}`;

type PackageManager = 'npm' | 'pnpm' | 'yarn';

function buildInstallCommand(manager: PackageManager, packages: string[], dev = false) {
  if (!packages.length) return '';

  if (manager === 'npm') {
    return dev ? `npm install -D ${packages.join(' ')}` : `npm install ${packages.join(' ')}`;
  }

  if (manager === 'pnpm') {
    return dev ? `pnpm add -D ${packages.join(' ')}` : `pnpm add ${packages.join(' ')}`;
  }

  return dev ? `yarn add -D ${packages.join(' ')}` : `yarn add ${packages.join(' ')}`;
}

export default function PackageJsonExplorer() {
  const [input, setInput] = useState(SAMPLE_PACKAGE_JSON);
  const [manager, setManager] = useState<PackageManager>('pnpm');
  const [copiedCommand, setCopiedCommand] = useState('');

  const parsed = useMemo(() => {
    try {
      return { data: JSON.parse(input) as Record<string, unknown>, error: '' };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error.message : 'Invalid package.json' };
    }
  }, [input]);

  const scripts = Object.entries((parsed.data?.scripts as Record<string, string> | undefined) ?? {});
  const dependencies = Object.entries((parsed.data?.dependencies as Record<string, string> | undefined) ?? {});
  const devDependencies = Object.entries((parsed.data?.devDependencies as Record<string, string> | undefined) ?? {});
  const packageManager = typeof parsed.data?.packageManager === 'string' ? parsed.data.packageManager : 'Not declared';

  const installCommand = buildInstallCommand(manager, dependencies.map(([name]) => name));
  const devInstallCommand = buildInstallCommand(manager, devDependencies.map(([name]) => name), true);

  const copyValue = async (value: string, key: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedCommand(key);
    window.setTimeout(() => setCopiedCommand(''), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setInput(SAMPLE_PACKAGE_JSON)} className="btn-secondary px-4 py-2 text-xs">
          Load sample
        </button>
        <button type="button" onClick={() => setInput('')} className="btn-ghost rounded-[18px] border border-slate-200 px-4 py-2 text-xs dark:border-slate-800">
          Clear
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Paste a package.json file</p>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            className={`tool-textarea font-mono text-[13px] leading-6 ${parsed.error ? 'border-red-300' : ''}`}
            style={{ minHeight: 420 }}
            placeholder='{"name":"app","scripts":{"dev":"next dev"}}'
          />
          {parsed.error && (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              {parsed.error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Scripts', scripts.length],
              ['Dependencies', dependencies.length],
              ['Dev deps', devDependencies.length],
              ['Package manager', packageManager],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-[22px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{label as string}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{String(value)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Install commands</p>
              <select
                value={manager}
                onChange={(event) => setManager(event.target.value as PackageManager)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="npm">npm</option>
                <option value="pnpm">pnpm</option>
                <option value="yarn">yarn</option>
              </select>
            </div>

            <div className="mt-4 space-y-3">
              {[
                ['Dependencies', installCommand, 'deps'],
                ['Dev dependencies', devInstallCommand, 'devDeps'],
              ].map(([label, value, key]) => (
                <div key={key as string} className="rounded-[18px] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label as string}</p>
                    <button type="button" onClick={() => void copyValue(value as string, key as string)} className="btn-ghost rounded-xl px-3 py-1.5 text-xs">
                      {copiedCommand === key ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <code className="mt-2 block break-all text-sm text-slate-700 dark:text-slate-200">{(value as string) || 'No packages detected.'}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Scripts</p>
          <div className="mt-3 space-y-2">
            {scripts.length ? scripts.map(([name, command]) => (
              <div key={name} className="rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                <span className="font-semibold text-slate-900 dark:text-white">{name}</span>
                <code className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{command}</code>
              </div>
            )) : <p className="text-sm text-slate-400 dark:text-slate-500">No scripts found.</p>}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Dependencies</p>
          <div className="mt-3 space-y-2">
            {dependencies.length ? dependencies.map(([name, version]) => (
              <div key={name} className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                <span className="font-medium text-slate-900 dark:text-white">{name}</span>
                <code className="text-xs text-slate-500 dark:text-slate-400">{version}</code>
              </div>
            )) : <p className="text-sm text-slate-400 dark:text-slate-500">No dependencies found.</p>}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Dev dependencies</p>
          <div className="mt-3 space-y-2">
            {devDependencies.length ? devDependencies.map(([name, version]) => (
              <div key={name} className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                <span className="font-medium text-slate-900 dark:text-white">{name}</span>
                <code className="text-xs text-slate-500 dark:text-slate-400">{version}</code>
              </div>
            )) : <p className="text-sm text-slate-400 dark:text-slate-500">No devDependencies found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
