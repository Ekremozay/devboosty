'use client';
// src/components/tools/ImageCompressor.tsx
// Uses browser-image-compression library for best results

import { useState, useRef, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

interface CompressedFile {
  original: File;
  originalSize: number;
  compressed: Blob | null;
  compressedSize: number;
  preview: string;
  savings: number;
  status: 'pending' | 'compressing' | 'done' | 'error';
  downloadUrl?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(2400);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    const entries: CompressedFile[] = fileArray.map(file => ({
      original: file,
      originalSize: file.size,
      compressed: null,
      compressedSize: 0,
      preview: URL.createObjectURL(file),
      savings: 0,
      status: 'pending' as const,
    }));
    setFiles(prev => [...prev, ...entries].slice(0, 20));
  }, []);

  const compressAll = async () => {
    const pending = files.filter(f => f.status === 'pending');
    if (pending.length === 0) return;

    setFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, status: 'compressing' } : f));

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;
      try {
        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: maxWidth,
          useWebWorker: true,
          initialQuality: quality / 100,
          fileType: files[i].original.type as string,
          alwaysKeepResolution: maxWidth >= 2400,
        };
        const compressed = await imageCompression(files[i].original, options);
        const downloadUrl = URL.createObjectURL(compressed);
        const savings = Math.round(((files[i].originalSize - compressed.size) / files[i].originalSize) * 100);
        setFiles(prev => prev.map((item, idx) =>
          idx === i
            ? { ...item, compressed, compressedSize: compressed.size, savings, status: 'done', downloadUrl }
            : item
        ));
      } catch {
        setFiles(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'error' } : item
        ));
      }
    }
  };

  const downloadAll = () => {
    files.forEach(f => {
      if (f.downloadUrl) {
        const a = document.createElement('a');
        a.href = f.downloadUrl;
        a.download = `compressed_${f.original.name}`;
        a.click();
      }
    });
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview);
      if (f.downloadUrl) URL.revokeObjectURL(f.downloadUrl);
    });
    setFiles([]);
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const doneCount = files.filter(f => f.status === 'done').length;
  const totalSaved = files.reduce((acc, f) => acc + (f.originalSize - f.compressedSize), 0);

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer
          ${dragging ? 'border-brand-400 bg-brand-50' : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
        <div className="py-12 flex flex-col items-center gap-3 pointer-events-none">
          <div className="text-5xl">🗜️</div>
          <div className="text-center">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Drop images here or click to browse</p>
            <p className="text-sm text-slate-400 mt-1">JPEG, PNG, WebP · Up to 20 files</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-4">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Compression Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-slate-600 dark:text-slate-400">Quality</label>
              <span className="text-sm font-bold text-brand-600">{quality}%</span>
            </div>
            <input
              type="range" min="10" max="100" value={quality}
              onChange={e => setQuality(+e.target.value)}
              className="w-full accent-brand-600 h-1.5 rounded-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Smallest</span><span>Highest quality</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400 block mb-2">Max Width</label>
            <select
              value={maxWidth}
              onChange={e => setMaxWidth(+e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={800}>800px (thumbnail)</option>
              <option value={1200}>1200px (web)</option>
              <option value={1920}>1920px (full HD)</option>
              <option value={2400}>2400px (no resize)</option>
            </select>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          {doneCount > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-green-700">
                ✓ Saved {formatBytes(totalSaved)} total ({doneCount} files compressed)
              </span>
              <button onClick={downloadAll} className="btn-primary text-xs">
                ⬇ Download All
              </button>
            </div>
          )}

          {files.map((file, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-700 bg-center bg-cover bg-no-repeat flex-shrink-0"
                style={{ backgroundImage: `url(${file.preview})` }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{file.original.name}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>Original: {formatBytes(file.originalSize)}</span>
                  {file.status === 'done' && (
                    <>
                      <span>→</span>
                      <span className="text-green-600 font-semibold">{formatBytes(file.compressedSize)}</span>
                      <span className="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">
                        -{file.savings}%
                      </span>
                    </>
                  )}
                  {file.status === 'compressing' && (
                    <span className="animate-pulse text-brand-600">Compressing…</span>
                  )}
                  {file.status === 'error' && (
                    <span className="text-red-500">Error compressing</span>
                  )}
                </div>
              </div>
              {file.downloadUrl && (
                <a
                  href={file.downloadUrl}
                  download={`compressed_${file.original.name}`}
                  className="btn-secondary text-xs flex-shrink-0"
                >
                  ⬇ Save
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {pendingCount > 0 && (
            <button onClick={compressAll} className="btn-primary">
              🗜️ Compress {pendingCount} Image{pendingCount !== 1 ? 's' : ''}
            </button>
          )}
          <button onClick={clearAll} className="btn-secondary">Clear All</button>
        </div>
      )}
    </div>
  );
}
