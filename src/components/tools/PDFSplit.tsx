'use client';
// src/components/tools/PDFSplit.tsx
import { useState, useRef } from 'react';

async function splitPDF(file: File, pages: number[]): Promise<Uint8Array[]> {
  const { PDFDocument } = await import('pdf-lib');
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const total = doc.getPageCount();
  const results: Uint8Array[] = [];
  for (const pageNum of pages) {
    if (pageNum < 1 || pageNum > total) continue;
    const newDoc = await PDFDocument.create();
    const [copied] = await newDoc.copyPages(doc, [pageNum - 1]);
    newDoc.addPage(copied);
    results.push(await newDoc.save());
  }
  return results;
}

export default function PDFSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rangeInput, setRangeInput] = useState('');
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [outputs, setOutputs] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f); setOutputs([]); setError('');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch { setError('Could not read PDF. Ensure it is a valid PDF file.'); }
  };

  const parseRange = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    input.split(',').forEach(part => {
      part = part.trim();
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(Number);
        for (let i = a; i <= Math.min(b, max); i++) pages.add(i);
      } else {
        const n = parseInt(part);
        if (!isNaN(n)) pages.add(n);
      }
    });
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !pageCount) return;
    setProcessing(true); setError(''); setOutputs([]);
    try {
      const pages = splitMode === 'all'
        ? Array.from({ length: pageCount }, (_, i) => i + 1)
        : parseRange(rangeInput, pageCount);
      if (!pages.length) { setError('No valid pages specified.'); setProcessing(false); return; }
      const results = await splitPDF(file, pages);
      const urls = results.map(bytes => URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })));
      setOutputs(urls);
    } catch { setError('Failed to split PDF.'); }
    finally { setProcessing(false); }
  };

  return (
    <div className="space-y-5">
      <div className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-red-300 hover:bg-slate-50 transition-all"
        onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="text-4xl mb-3">✂️</div>
        <p className="font-semibold text-slate-700">{file ? file.name : 'Click to upload a PDF'}</p>
        {pageCount > 0 && <p className="text-sm text-slate-500 mt-1">{pageCount} pages detected</p>}
      </div>

      {pageCount > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-4">
          <div className="flex gap-3">
            {[['all', `Extract all ${pageCount} pages`], ['range', 'Extract specific pages']].map(([k, l]) => (
              <button key={k} onClick={() => setSplitMode(k as 'all' | 'range')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${splitMode === k ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                {l}
              </button>
            ))}
          </div>
          {splitMode === 'range' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Page range (e.g. 1-3, 5, 7-9)</label>
              <input type="text" value={rangeInput} onChange={e => setRangeInput(e.target.value)}
                placeholder="1-3, 5, 7-9" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          )}
        </div>
      )}

      {error && <div className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">⚠ {error}</div>}

      {outputs.length > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-3">
          <p className="font-semibold text-green-700">✓ {outputs.length} page{outputs.length !== 1 ? 's' : ''} extracted</p>
          <div className="flex flex-wrap gap-2">
            {outputs.map((url, i) => (
              <a key={i} href={url} download={`page_${i + 1}.pdf`} className="btn-secondary text-xs">⬇ Page {i + 1}</a>
            ))}
          </div>
        </div>
      )}

      {file && (
        <button onClick={handleSplit} disabled={processing || !pageCount}
          className={`btn-primary ${processing ? 'opacity-50' : ''}`}>
          {processing ? <span className="flex items-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />Splitting…</span> : '✂️ Split PDF'}
        </button>
      )}
    </div>
  );
}
