'use client';

import { useMemo, useState } from 'react';

function parseList(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function quoteList(items: string[]) {
  return items.map((item) => `'${item}'`).join(', ');
}

export default function CIMatrixBuilder() {
  const [workflowName, setWorkflowName] = useState('ci');
  const [jobName, setJobName] = useState('test');
  const [nodeVersions, setNodeVersions] = useState('18, 20, 22');
  const [systems, setSystems] = useState('ubuntu-latest, windows-latest, macos-latest');
  const [packageManagers, setPackageManagers] = useState<string[]>(['pnpm', 'npm']);
  const [copied, setCopied] = useState(false);

  const nodeList = parseList(nodeVersions);
  const systemList = parseList(systems);

  const yaml = useMemo(() => {
    const managers = packageManagers.length ? packageManagers : ['pnpm'];

    return `name: ${workflowName}

on:
  push:
  pull_request:

jobs:
  ${jobName}:
    runs-on: \${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [${quoteList(systemList)}]
        node: [${quoteList(nodeList)}]
        packageManager: [${quoteList(managers)}]

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: \${{ matrix.packageManager }}
      - name: Install dependencies
        run: |
          if [ "\${{ matrix.packageManager }}" = "pnpm" ]; then corepack enable && pnpm install --frozen-lockfile; fi
          if [ "\${{ matrix.packageManager }}" = "npm" ]; then npm ci; fi
          if [ "\${{ matrix.packageManager }}" = "yarn" ]; then yarn install --immutable; fi
      - name: Run test suite
        run: npm test`;
  }, [jobName, nodeList, packageManagers, systemList, workflowName]);

  const toggleManager = (value: string) => {
    setPackageManagers((current) => (
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    ));
  };

  const copyYaml = async () => {
    await navigator.clipboard.writeText(yaml);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Workflow name</label>
            <input
              type="text"
              value={workflowName}
              onChange={(event) => setWorkflowName(event.target.value)}
              className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Job id</label>
            <input
              type="text"
              value={jobName}
              onChange={(event) => setJobName(event.target.value)}
              className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Node versions</label>
            <input
              type="text"
              value={nodeVersions}
              onChange={(event) => setNodeVersions(event.target.value)}
              className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="18, 20, 22"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Operating systems</label>
            <input
              type="text"
              value={systems}
              onChange={(event) => setSystems(event.target.value)}
              className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="ubuntu-latest, windows-latest"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Package managers</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['pnpm', 'npm', 'yarn'].map((manager) => {
                const active = packageManagers.includes(manager);
                return (
                  <button
                    key={manager}
                    type="button"
                    onClick={() => toggleManager(manager)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {manager}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Generated GitHub Actions matrix</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Copy the snippet into your workflow file and tune the install or test commands as needed.</p>
            </div>
            <button type="button" onClick={copyYaml} className="btn-primary px-4 py-2 text-xs">
              {copied ? 'Copied' : 'Copy YAML'}
            </button>
          </div>

          <textarea
            value={yaml}
            readOnly
            spellCheck={false}
            className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 420 }}
          />
        </div>
      </div>
    </div>
  );
}
