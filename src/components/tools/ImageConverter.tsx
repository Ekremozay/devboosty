'use client';
// src/components/tools/ImageConverter.tsx
// Handles JPG→PNG and PNG→WebP based on current route
import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
export default function ImageConverter() {
  const pathname = usePathname();
  const isJpgToPng = pathname?.includes('jpg-to-png');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState('');
  const [converting, setConverting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const accept = isJpgToPng ? 'image/jpeg,image/jpg' : 'image/png';
  const targetType = isJpgToPng ? 'image/png' : 'image/webp';
  const targetExt = isJpgToPng ? 'png' : 'webp';
  const convert = () => {
    if (!file) return;
    setConverting(true);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (blob) { setOutput(URL.createObjectURL(blob)); }
        setConverting(false); URL.revokeObjectURL(url);
      }, targetType, 0.95);
    };
    img.src = url;
  };
  const handleFile = (f: File) => { setFile(f); setPreview(URL.createObjectURL(f)); setOutput(''); };
  return (
    <div className="space-y-5">
      <div className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-brand-300 hover:bg-slate-50 transition-all" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="text-4xl mb-3">🖼️</div>
        <p className="font-semibold text-slate-700">Click to upload {isJpgToPng ? 'JPG/JPEG' : 'PNG'} image</p>
        <p className="text-sm text-slate-400 mt-1">All conversion happens locally in your browser</p>
      </div>
      {preview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2"><label className="text-sm font-semibold text-slate-600">Original ({file?.name})</label>
            <img src={preview} alt="Original" className="rounded-xl border border-slate-100 w-full object-contain max-h-64" /></div>
          {output && <div className="space-y-2"><label className="text-sm font-semibold text-green-600">✓ Converted (.{targetExt})</label>
            <img src={output} alt="Converted" className="rounded-xl border border-green-100 w-full object-contain max-h-64" />
            <a href={output} download={`converted.${targetExt}`} className="btn-primary text-xs">⬇ Download .{targetExt}</a></div>}
        </div>
      )}
      {file && !output && (
        <button onClick={convert} disabled={converting} className={`btn-primary ${converting ? 'opacity-50' : ''}`}>
          {converting ? 'Converting…' : `Convert to .${targetExt}`}
        </button>
      )}
    </div>
  );
}
