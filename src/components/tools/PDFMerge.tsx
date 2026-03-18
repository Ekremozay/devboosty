'use client';
// src/components/tools/PDFMerge.tsx

import { useState, useRef, useCallback } from 'react';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function mergePDFs(files: PDFFile[]): Promise<Uint8Array> {
  // Dynamically import pdf-lib to keep initial bundle lean
  const { PDFDocument } = await import('pdf-lib');
  const merged = await PDFDocument.create();
  for (const f of files) {
    const bytes = await f.file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  return merged.save();
}

export default function PDFMerge() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const pdfs = Array.from(newFiles).filter(f => f.type === 'application/pdf');
    if (!pdfs.length) return;
    setDone(false);
    setDownloadUrl(null);
    const entries: PDFFile[] = pdfs.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      name: file.name,
      size: file.size,
      pageCount: null,
    }));
    setFiles(prev => [...prev, ...entries].slice(0, 20));
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setDone(false);
  };

  const moveFile = (from: number, to: number) => {
    setFiles(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    setError('');
    try {
      const merged = await mergePDFs(files);
      const blob = new Blob([merged.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDone(true);
    } catch (e) {
      setError('Failed to merge PDFs. Please ensure all files are valid PDFs.');
    } finally {
      setMerging(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setDone(false);
    setDownloadUrl(null);
    setError('');
  };

  const totalSize = files.reduce((a, f) => a + f.size, 0);

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer
          ${dragging ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-red-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
        <div className="py-12 flex flex-col items-center gap-3 pointer-events-none">
          <div className="text-5xl">📄</div>
          <div className="text-center">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Drop PDF files here or click to browse</p>
            <p className="text-sm text-slate-400 mt-1">Select multiple PDFs · Up to 20 files · All processing is local</p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {files.length} file{files.length !== 1 ? 's' : ''} · {formatBytes(totalSize)} total
            </div>
            <p className="text-xs text-slate-400">Drag rows to reorder</p>
          </div>

          {files.map((file, i) => (
            <div
              key={file.id}
              draggable
              onDragStart={e => e.dataTransfer.setData('idx', String(i))}
              onDragOver={e => { e.preventDefault(); setDragOver(i); }}
              onDrop={e => {
                e.preventDefault();
                const from = +e.dataTransfer.getData('idx');
                moveFile(from, i);
                setDragOver(null);
              }}
              onDragLeave={() => setDragOver(null)}
              className={`bg-white dark:bg-slate-800 rounded-xl border flex items-center gap-4 px-4 py-3 transition-all cursor-grab active:cursor-grabbing
                ${dragOver === i ? 'border-brand-400 shadow-md' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}
            >
              <div className="text-slate-300 dark:text-slate-600 text-lg select-none">⠿</div>
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-sm font-bold text-red-600">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{formatBytes(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="w-7 h-7 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
          ⚠ {error}
        </div>
      )}

      {/* Success */}
      {done && downloadUrl && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-green-700">✓ PDFs merged successfully!</p>
            <p className="text-sm text-green-600 mt-0.5">{files.length} files combined into one document</p>
          </div>
          <a
            href={downloadUrl}
            download="merged.pdf"
            className="btn-primary bg-green-600 hover:bg-green-700 flex-shrink-0"
          >
            ⬇ Download PDF
          </a>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleMerge}
          disabled={files.length < 2 || merging}
          className={`btn-primary ${files.length < 2 || merging ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {merging ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Merging…
            </span>
          ) : (
            `📎 Merge ${files.length} PDF${files.length !== 1 ? 's' : ''}`
          )}
        </button>
        {files.length > 0 && (
          <button onClick={clearAll} className="btn-secondary">Clear All</button>
        )}
        {files.length > 0 && (
          <button onClick={() => inputRef.current?.click()} className="btn-secondary">+ Add More</button>
        )}
      </div>

      {files.length < 2 && files.length > 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Add at least one more PDF to enable merging.
        </p>
      )}
    </div>
  );
}
