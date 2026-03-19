'use client';

import { useEffect, useRef, useState } from 'react';

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

interface Preset {
  label: string;
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  cleanup: number;
}

const PRESETS: Preset[] = [
  { label: 'Screenshot Boost', brightness: 112, contrast: 118, saturation: 106, warmth: 4, cleanup: 0.2 },
  { label: 'Product Pop', brightness: 108, contrast: 122, saturation: 112, warmth: 7, cleanup: 0.4 },
  { label: 'Social Clean', brightness: 104, contrast: 114, saturation: 124, warmth: 10, cleanup: 0.8 },
];

export default function ImageEnhancer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [fileName, setFileName] = useState('enhanced-image');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [warmth, setWarmth] = useState(0);
  const [cleanup, setCleanup] = useState(0.2);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [originalUrl, outputUrl]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setOriginalUrl(URL.createObjectURL(file));
    setOutputUrl('');
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'enhanced-image');
  };

  useEffect(() => {
    if (!originalUrl) return;

    const timer = window.setTimeout(async () => {
      setProcessing(true);

      try {
        const image = await loadImage(originalUrl);
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${cleanup}px)`;
        context.drawImage(image, 0, 0);

        if (warmth !== 0) {
          const frame = context.getImageData(0, 0, canvas.width, canvas.height);
          const delta = (warmth / 100) * 38;

          for (let index = 0; index < frame.data.length; index += 4) {
            frame.data[index] = Math.max(0, Math.min(255, frame.data[index] + delta));
            frame.data[index + 1] = Math.max(0, Math.min(255, frame.data[index + 1] + delta * 0.15));
            frame.data[index + 2] = Math.max(0, Math.min(255, frame.data[index + 2] - delta * 0.55));
          }

          context.putImageData(frame, 0, 0);
        }

        canvas.toBlob((blob) => {
          if (!blob) return;
          setOutputUrl((current) => {
            if (current) URL.revokeObjectURL(current);
            return URL.createObjectURL(blob);
          });
        }, 'image/png', 0.96);
      } finally {
        setProcessing(false);
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [brightness, cleanup, contrast, originalUrl, saturation, warmth]);

  const applyPreset = (preset: Preset) => {
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setWarmth(preset.warmth);
    setCleanup(preset.cleanup);
  };

  return (
    <div className="space-y-6">
      <div
        className={`rounded-[28px] border-2 border-dashed p-10 text-center transition-all ${
          dragging
            ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10'
            : 'border-slate-200 bg-white/60 hover:border-brand-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-900/50'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files[0]) handleFile(event.dataTransfer.files[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.[0]) handleFile(event.target.files[0]);
          }}
        />
        <div className="text-4xl">✨</div>
        <p className="mt-4 font-semibold text-slate-900 dark:text-white">Drop a screenshot or image to enhance</p>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Live browser-based cleanup for product shots, UI captures, and social assets.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button key={preset.label} type="button" onClick={() => applyPreset(preset)} className="btn-secondary px-4 py-2 text-xs">
            {preset.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          {[
            ['Brightness', brightness, setBrightness, 70, 140, '%'],
            ['Contrast', contrast, setContrast, 70, 150, '%'],
            ['Saturation', saturation, setSaturation, 60, 160, '%'],
            ['Warmth', warmth, setWarmth, -20, 30, ''],
          ].map(([label, value, setter, min, max, suffix]) => (
            <div key={label as string}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{label as string}</p>
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  {String(value)}
                  {suffix as string}
                </span>
              </div>
              <input
                type="range"
                min={Number(min)}
                max={Number(max)}
                value={Number(value)}
                onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))}
                className="mt-3 w-full accent-brand-500"
              />
            </div>
          ))}

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Cleanup</p>
              <span className="text-sm text-slate-400 dark:text-slate-500">{cleanup.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={cleanup}
              onChange={(event) => setCleanup(Number(event.target.value))}
              className="mt-3 w-full accent-brand-500"
            />
          </div>

          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            {processing ? 'Rendering your current adjustments...' : 'Changes auto-render as you tune the sliders.'}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Original</p>
            <div className="flex min-h-[360px] items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              {originalUrl ? (
                <img src={originalUrl} alt="Original upload" className="max-h-[360px] w-full object-contain" />
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">Upload an image to preview it.</p>
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Enhanced output</p>
              {outputUrl && (
                <a href={outputUrl} download={`${fileName}-enhanced.png`} className="btn-primary px-4 py-2 text-xs">
                  Download PNG
                </a>
              )}
            </div>
            <div className="flex min-h-[360px] items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              {outputUrl ? (
                <img src={outputUrl} alt="Enhanced export" className="max-h-[360px] w-full object-contain" />
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">The enhanced version appears here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
