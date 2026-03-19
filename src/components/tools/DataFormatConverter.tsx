'use client';

import { useMemo, useState } from 'react';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import Papa from 'papaparse';
import YAML from 'yaml';

type FormatKind = 'json' | 'yaml' | 'xml' | 'csv';

const SAMPLE_BY_FORMAT: Record<FormatKind, string> = {
  json: `{
  "project": "DevBoosty",
  "stack": ["Next.js", "TailwindCSS", "TypeScript"],
  "active": true
}`,
  yaml: `project: DevBoosty
stack:
  - Next.js
  - TailwindCSS
  - TypeScript
active: true
`,
  xml: `<root>
  <project>DevBoosty</project>
  <stack>
    <item>Next.js</item>
    <item>TailwindCSS</item>
    <item>TypeScript</item>
  </stack>
  <active>true</active>
</root>`,
  csv: `project,stack,active
DevBoosty,"Next.js | TailwindCSS | TypeScript",true`,
};

function parseInput(format: FormatKind, input: string) {
  if (format === 'json') return JSON.parse(input);
  if (format === 'yaml') return YAML.parse(input);

  if (format === 'xml') {
    const validation = XMLValidator.validate(input);
    if (validation !== true) {
      throw new Error(typeof validation === 'object' && 'err' in validation ? validation.err.msg : 'Invalid XML');
    }
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      trimValues: true,
    });
    return parser.parse(input);
  }

  const parsed = Papa.parse<Record<string, string>>(input, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length) {
    throw new Error(parsed.errors[0].message);
  }

  return parsed.data;
}

function serializeOutput(format: FormatKind, data: unknown) {
  if (format === 'json') return JSON.stringify(data, null, 2);
  if (format === 'yaml') return YAML.stringify(data);

  if (format === 'xml') {
    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      suppressEmptyNode: true,
    });

    const base = Array.isArray(data) ? { root: { item: data } } : data;
    return builder.build(base);
  }

  if (!Array.isArray(data)) {
    const wrapped = data && typeof data === 'object' ? [data as Record<string, unknown>] : [{ value: String(data ?? '') }];
    return Papa.unparse(wrapped);
  }

  return Papa.unparse(data as Array<Record<string, unknown>>);
}

export default function DataFormatConverter() {
  const [sourceFormat, setSourceFormat] = useState<FormatKind>('json');
  const [targetFormat, setTargetFormat] = useState<FormatKind>('yaml');
  const [input, setInput] = useState(SAMPLE_BY_FORMAT.json);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    return [
      ['Input chars', String(input.length)],
      ['Output chars', String(output.length)],
      ['Source', sourceFormat.toUpperCase()],
      ['Target', targetFormat.toUpperCase()],
    ];
  }, [input.length, output.length, sourceFormat, targetFormat]);

  const convert = () => {
    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = parseInput(sourceFormat, input);
      const serialized = serializeOutput(targetFormat, parsed);
      setOutput(serialized);
      setError('');
    } catch (conversionError) {
      setOutput('');
      setError(conversionError instanceof Error ? conversionError.message : 'Conversion failed');
    }
  };

  const loadSample = (format: FormatKind) => {
    setSourceFormat(format);
    setInput(SAMPLE_BY_FORMAT[format]);
    setOutput('');
    setError('');
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-slate-200 bg-white/70 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
        Convert structured data between JSON, YAML, XML, and CSV in the browser. Best for developer payloads, config files, and quick transformations.
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">From</span>
          <select
            value={sourceFormat}
            onChange={(event) => setSourceFormat(event.target.value as FormatKind)}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {(['json', 'yaml', 'xml', 'csv'] as FormatKind[]).map((format) => (
              <option key={format} value={format}>{format.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">To</span>
          <select
            value={targetFormat}
            onChange={(event) => setTargetFormat(event.target.value as FormatKind)}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {(['json', 'yaml', 'xml', 'csv'] as FormatKind[]).map((format) => (
              <option key={format} value={format}>{format.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <button type="button" onClick={convert} className="btn-primary px-4 py-2.5 text-sm">
          Convert
        </button>
        <button type="button" onClick={() => loadSample(sourceFormat)} className="btn-secondary px-4 py-2.5 text-xs">
          Load sample
        </button>
        <button type="button" onClick={() => { setInput(''); setOutput(''); setError(''); }} className="btn-ghost rounded-[18px] border border-slate-200 px-4 py-2.5 text-xs dark:border-slate-800">
          Clear
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['json', 'yaml', 'xml', 'csv'] as FormatKind[]).map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => loadSample(format)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-200"
          >
            Sample {format.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Input</p>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            className={`tool-textarea font-mono text-[13px] leading-6 ${error ? 'border-red-300' : ''}`}
            style={{ minHeight: 360 }}
            placeholder="Paste data here"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Converted output</p>
            <button type="button" onClick={copyOutput} className="btn-secondary px-4 py-2 text-xs" disabled={!output}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            spellCheck={false}
            className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 360 }}
            placeholder="Converted output appears here"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-[20px] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
