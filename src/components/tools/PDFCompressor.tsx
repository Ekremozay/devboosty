'use client';
// src/components/tools/PDFCompressor.tsx
// Note: true PDF compression requires server-side processing (Ghostscript etc.)
// This client-side version re-saves the PDF with pdf-lib which removes unused objects.
import { useState, useRef } from 'react';

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => { setFile(f); setOriginalSize(f.size); setOutputUrl(''); setError(''); };

  const compress = async () => {
    if (!file) return;
    setProcessing(true); setError('');
    try {
      const { PDFDocument } = await import('pdf-lib');
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      // Re-save with object streaming to compress
      const saved = await doc.save({ useObjectStreams: true, addDefaultPage: false });
      const blob = new Blob([saved.buffer as ArrayBuffer], { type: 'application/pdf' });
      setCompressedSize(blob.size);
      setOutputUrl(URL.createObjectURL(blob));
    } catch { setError('Failed to compress PDF. The file may be encrypted or corrupted.'); }
    finally { setProcessing(false); }
  };

  const savings = originalSize && compressedSize ? Math.round((1 - compressedSize / originalSize) * 100) : 0;
  const fmt = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <div className="space-y-5">
      <div className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-red-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
        onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="text-4xl mb-3">📉</div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">{file ? file.name : 'Click to upload a PDF'}</p>
        {originalSize > 0 && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Size: {fmt(originalSize)}</p>}
      </div>

      {error && <div className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">⚠ {error}</div>}

      {outputUrl && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-700">✓ PDF optimized</p>
              <div className="flex gap-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                <span>Before: <strong>{fmt(originalSize)}</strong></span>
                <span>After: <strong>{fmt(compressedSize)}</strong></span>
                <span className={`font-bold ${savings > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                  {savings > 0 ? `-${savings}%` : 'No change (already optimized)'}
                </span>
              </div>
            </div>
            <a href={outputUrl} download="compressed.pdf" className="btn-primary text-xs">⬇ Download</a>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
        <strong>Note:</strong> Client-side PDF optimization removes redundant objects and cross-reference tables.
        For maximum compression (especially image-heavy PDFs), server-side tools like Ghostscript achieve better results.
      </div>

      {file && !outputUrl && (
        <button onClick={compress} disabled={processing} className={`btn-primary ${processing ? 'opacity-50' : ''}`}>
          {processing ? <span className="flex items-center gap-2"><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />Optimizing…</span> : '📉 Compress PDF'}
        </button>
      )}
    </div>
  );
}
