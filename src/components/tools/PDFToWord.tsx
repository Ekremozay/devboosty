'use client';
// src/components/tools/PDFToWord.tsx
// Uses pdfjs-dist for accurate client-side text extraction
import { useState, useRef } from 'react';

export default function PDFToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => { setFile(f); setText(''); setDone(false); setError(''); setProgress(0); setPageCount(0); };

  const convert = async () => {
    if (!file) return;
    setProcessing(true); setError(''); setProgress(0);
    try {
      const bytes = await file.arrayBuffer();
      const extracted = await extractTextWithPDFJS(bytes, setProgress, setPageCount);
      setText(extracted || `[Could not extract text from this PDF — it may be scanned or image-only]`);
      setDone(true);
    } catch (e) {
      setError(`Could not process this PDF: ${e instanceof Error ? e.message : 'Unknown error'}. It may be encrypted or corrupted.`);
    } finally {
      setProcessing(false);
    }
  };

  const downloadRTF = () => {
    const rtf = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}}\n{\\f0\\fs24 ${text.replace(/\n/g, '\\par\n').replace(/[{}\\]/g, '\\$&')}}\n}`;
    const blob = new Blob([rtf], { type: 'application/rtf' });
    triggerDownload(blob, file?.name.replace('.pdf', '.rtf') || 'converted.rtf');
  };

  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    triggerDownload(blob, file?.name.replace('.pdf', '.txt') || 'converted.txt');
  };

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div
        className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-red-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f?.type === 'application/pdf') handleFile(f); }}
      >
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="text-4xl mb-3">📄</div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">{file ? file.name : 'Drop or click to upload a PDF'}</p>
        <p className="text-sm text-slate-400 mt-1">Text-based PDFs · Drag & drop supported</p>
        {file && <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>}
      </div>

      {error && <div className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">⚠ {error}</div>}

      {processing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>Extracting text{pageCount ? ` (${pageCount} pages)` : ''}…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {done && text && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">✓ {wordCount.toLocaleString()} words extracted</span>
              {pageCount > 0 && <span className="text-xs text-slate-400">from {pageCount} pages</span>}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={downloadRTF} className="btn-secondary text-xs">⬇ Word (.rtf)</button>
              <button onClick={downloadTxt} className="btn-secondary text-xs">⬇ Plain text (.txt)</button>
            </div>
          </div>
          <textarea
            className="tool-textarea bg-slate-50 dark:bg-slate-900/50"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ minHeight: 320 }}
          />
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-300">
        <strong>💡 Tip:</strong> Uses PDF.js for accurate text extraction. Scanned or image-only PDFs require OCR and won't have extractable text. The RTF output opens in Microsoft Word, Google Docs, and LibreOffice.
      </div>

      {file && !done && (
        <button onClick={convert} disabled={processing} className={`btn-primary ${processing ? 'opacity-50' : ''}`}>
          {processing
            ? <span className="flex items-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />Extracting…</span>
            : '📄 Extract & Convert'}
        </button>
      )}
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

async function extractTextWithPDFJS(
  bytes: ArrayBuffer,
  onProgress: (p: number) => void,
  onPageCount: (n: number) => void,
): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');

  // Use CDN worker — avoids Next.js worker bundling issues
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const total = pdf.numPages;
  onPageCount(total);

  const pageTexts: string[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let lastY: number | null = null;
    let line = '';
    const lines: string[] = [];

    for (const item of content.items) {
      if (!('str' in item)) continue;
      const { str, transform } = item as { str: string; transform: number[] };
      const y = transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        if (line.trim()) lines.push(line.trim());
        line = str;
      } else {
        line += str;
      }
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
    pageTexts.push(lines.join('\n'));
    onProgress(Math.round((i / total) * 100));
  }

  return pageTexts.join('\n\n');
}
