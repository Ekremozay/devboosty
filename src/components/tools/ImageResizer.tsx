'use client';
// src/components/tools/ImageResizer.tsx
import { useState, useRef } from 'react';
export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState('');
  const [origW, setOrigW] = useState(0); const [origH, setOrigH] = useState(0);
  const [w, setW] = useState(800); const [h, setH] = useState(600);
  const [lock, setLock] = useState(true);
  const [resizing, setResizing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = (f: File) => {
    setFile(f); const url = URL.createObjectURL(f); setPreview(url); setOutput('');
    const img = new Image(); img.onload = () => { setOrigW(img.width); setOrigH(img.height); setW(img.width); setH(img.height); }; img.src = url;
  };
  const updateW = (v: number) => { setW(v); if (lock && origW) setH(Math.round(v * origH / origW)); };
  const updateH = (v: number) => { setH(v); if (lock && origH) setW(Math.round(v * origW / origH)); };
  const resize = () => {
    if (!file) return; setResizing(true);
    const img = new Image(); img.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => { if (blob) setOutput(URL.createObjectURL(blob)); setResizing(false); }, file.type || 'image/jpeg', 0.95);
    }; img.src = URL.createObjectURL(file);
  };
  return (
    <div className="space-y-5">
      <div className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer hover:border-brand-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div className="text-4xl mb-3">📐</div>
        <p className="font-semibold text-slate-700 dark:text-slate-300">Click to upload an image</p>
        {origW > 0 && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Original: {origW} × {origH}px</p>}
      </div>
      {file && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 space-y-4">
          <div className="flex items-end gap-3">
            <div><label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Width (px)</label>
              <input type="number" value={w} onChange={e => updateW(+e.target.value)} min="1" className="w-28 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
            <button onClick={() => setLock(v => !v)} className={`mb-0.5 px-3 py-2 rounded-lg border text-sm transition-colors ${lock ? 'bg-brand-50 border-brand-200 text-brand-600' : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400'}`} title="Lock aspect ratio">
              {lock ? '🔒' : '🔓'}
            </button>
            <div><label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Height (px)</label>
              <input type="number" value={h} onChange={e => updateH(+e.target.value)} min="1" className="w-28 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" /></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[[640,480],[800,600],[1024,768],[1280,720],[1920,1080]].map(([pw,ph]) => (
              <button key={`${pw}x${ph}`} onClick={() => { setW(pw); setH(ph); setLock(false); }} className="text-xs bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">{pw}×{ph}</button>
            ))}
          </div>
        </div>
      )}
      {output && <div className="space-y-2"><label className="text-sm font-semibold text-green-600">✓ Resized to {w}×{h}px</label>
        <img src={output} alt="Resized" className="rounded-xl border border-green-100 max-w-sm" />
        <a href={output} download={`resized_${w}x${h}.${file?.name.split('.').pop()}`} className="btn-primary text-xs inline-flex">⬇ Download</a></div>}
      {file && !output && <button onClick={resize} disabled={resizing} className={`btn-primary ${resizing ? 'opacity-50' : ''}`}>{resizing ? 'Resizing…' : `Resize to ${w}×${h}px`}</button>}
    </div>
  );
}
