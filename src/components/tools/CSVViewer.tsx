'use client';

import { useState, useRef, useCallback } from 'react';
import Papa from 'papaparse';

const SAMPLE_CSV = `name,email,role,department,salary
Alice Johnson,alice@example.com,Engineer,Engineering,95000
Bob Smith,bob@example.com,Designer,Product,88000
Carol White,carol@example.com,Manager,Engineering,120000
David Brown,david@example.com,Analyst,Finance,78000
Eve Davis,eve@example.com,Engineer,Engineering,92000`;

type Row = Record<string, string>;

export default function CSVViewer() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [rawCsv, setRawCsv] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseCSV = useCallback((text: string) => {
    setError('');
    const result = Papa.parse<Row>(text, { header: true, skipEmptyLines: true, dynamicTyping: false });
    if (result.errors.length > 0 && result.data.length === 0) {
      setError(result.errors[0].message);
      return;
    }
    setHeaders(result.meta.fields ?? []);
    setRows(result.data);
    setSearch('');
    setSortCol('');
  }, []);

  const handleFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      setRawCsv(text);
      parseCSV(text);
    };
    reader.readAsText(f);
  };

  const handleTextInput = (text: string) => {
    setRawCsv(text);
    if (text.trim()) parseCSV(text);
    else { setHeaders([]); setRows([]); }
  };

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const filteredRows = rows.filter(row =>
    !search || Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const sortedRows = sortCol
    ? [...filteredRows].sort((a, b) => {
        const av = a[sortCol] ?? '';
        const bv = b[sortCol] ?? '';
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filteredRows;

  const downloadCSV = () => {
    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'data.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const copyCSV = () => {
    navigator.clipboard.writeText(rawCsv).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        View, search, and sort CSV files in your browser. Upload a file or paste CSV text directly.
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-3 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">CSV Input</label>
          <div
            className="flex cursor-pointer flex-col items-center rounded-[20px] border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900/60"
            onClick={() => inputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          >
            <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <div className="text-3xl">📊</div>
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Drop or choose a CSV file</p>
            <p className="text-xs text-slate-400 mt-1">or paste below</p>
          </div>
          <textarea
            className="tool-textarea font-mono text-xs"
            value={rawCsv}
            onChange={e => handleTextInput(e.target.value)}
            placeholder="Paste CSV text here..."
            style={{ minHeight: 160 }}
          />
          <div className="flex gap-2">
            <button onClick={() => { setRawCsv(SAMPLE_CSV); parseCSV(SAMPLE_CSV); }} className="btn-ghost text-sm">Load sample</button>
            <button onClick={() => { setRawCsv(''); setHeaders([]); setRows([]); setError(''); }} className="btn-ghost text-sm">Clear</button>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">Info</label>
          {rows.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[['Rows', rows.length], ['Columns', headers.length], ['Showing', sortedRows.length], ['Size', `${(rawCsv.length / 1024).toFixed(1)} KB`]].map(([l, v]) => (
                  <div key={l as string} className="rounded-[18px] bg-slate-50 dark:bg-slate-900/60 p-3 text-center">
                    <div className="text-xl font-bold text-brand-600 dark:text-brand-400">{v}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{l}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={copyCSV} className="btn-secondary text-xs">{copied ? '✓ Copied' : 'Copy CSV'}</button>
                <button onClick={downloadCSV} className="btn-secondary text-xs">⬇ Download</button>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Columns</label>
                <div className="flex flex-wrap gap-1.5">
                  {headers.map(h => (
                    <span key={h} className="rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-2.5 py-0.5 text-xs font-medium">{h}</span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400 py-8 text-center">Upload or paste CSV to see stats</div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">⚠ {error}</div>
      )}

      {rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter rows..."
              className="flex-1 rounded-[18px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-300"
            />
            {search && <button onClick={() => setSearch('')} className="btn-ghost text-sm">Clear filter</button>}
          </div>
          <div className="overflow-x-auto rounded-[20px] border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-left">
                <tr>
                  {headers.map(h => (
                    <th key={h} onClick={() => handleSort(h)} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 whitespace-nowrap select-none">
                      {h} {sortCol === h ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {sortedRows.slice(0, 200).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {headers.map(h => (
                      <td key={h} className="px-4 py-2.5 text-slate-700 dark:text-slate-300 max-w-[240px] truncate">{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedRows.length > 200 && (
              <div className="text-center py-3 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700">Showing first 200 of {sortedRows.length} rows</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
