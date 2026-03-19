'use client';

import { useState } from 'react';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageToBase64() {
  const [preview, setPreview] = useState('');
  const [base64, setBase64] = useState('');
  const [dataUri, setDataUri] = useState('');
  const [meta, setMeta] = useState<{ name: string; size: number; type: string } | null>(null);
  const [copied, setCopied] = useState<'base64' | 'data-uri' | ''>('');

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      setDataUri(result);
      setBase64(result.split(',')[1] ?? '');
      setPreview(result);
      setMeta({ name: file.name, size: file.size, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const copy = async (value: string, type: 'base64' | 'data-uri') => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(''), 1800);
  };

  return (
    <div className="space-y-5">
      <label className="flex cursor-pointer flex-col items-center rounded-[28px] border-2 border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center transition-colors hover:border-brand-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:bg-slate-900/60">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.[0]) handleFile(event.target.files[0]);
          }}
        />
        <div className="text-4xl">🖼️</div>
        <p className="mt-4 font-semibold text-slate-900 dark:text-white">Upload an image to generate Base64</p>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">PNG, JPG, SVG, WebP and other image types supported.</p>
      </label>

      {meta && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['File', meta.name],
            ['Size', formatBytes(meta.size)],
            ['Type', meta.type || 'Unknown'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[20px] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label}</p>
              <p className="mt-2 break-all text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Preview</p>
          <div className="mt-4 flex min-h-[240px] items-center justify-center rounded-[18px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <img src={preview} alt="Uploaded preview" className="max-h-[240px] w-full object-contain" />
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Base64 only</p>
            <button type="button" onClick={() => copy(base64, 'base64')} className="btn-secondary px-4 py-2 text-xs" disabled={!base64}>
              {copied === 'base64' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={base64}
            readOnly
            className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 260 }}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Data URI</p>
            <button type="button" onClick={() => copy(dataUri, 'data-uri')} className="btn-secondary px-4 py-2 text-xs" disabled={!dataUri}>
              {copied === 'data-uri' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={dataUri}
            readOnly
            className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 260 }}
          />
        </div>
      </div>
    </div>
  );
}
