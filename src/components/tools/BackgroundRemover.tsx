'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type RGB = {
  r: number;
  g: number;
  b: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string): RGB {
  const candidate = /^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex) ? hex : '#ffffff';
  const normalized = candidate.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((value) => value + value).join('')
    : normalized;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

function colorDistance(red: number, green: number, blue: number, target: RGB) {
  return Math.sqrt(
    (red - target.r) ** 2 +
    (green - target.g) ** 2 +
    (blue - target.b) ** 2,
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Image could not be loaded.'));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error('PNG export failed.'));
    }, type);
  });
}

function detectBackgroundColor(data: Uint8ClampedArray, width: number, height: number): RGB {
  const sampleWidth = Math.max(4, Math.min(28, Math.floor(width * 0.08)));
  const sampleHeight = Math.max(4, Math.min(28, Math.floor(height * 0.08)));
  const corners = [
    { startX: 0, startY: 0 },
    { startX: Math.max(0, width - sampleWidth), startY: 0 },
    { startX: 0, startY: Math.max(0, height - sampleHeight) },
    { startX: Math.max(0, width - sampleWidth), startY: Math.max(0, height - sampleHeight) },
  ];

  let redTotal = 0;
  let greenTotal = 0;
  let blueTotal = 0;
  let count = 0;

  corners.forEach(({ startX, startY }) => {
    for (let y = startY; y < startY + sampleHeight; y += 1) {
      for (let x = startX; x < startX + sampleWidth; x += 1) {
        const offset = (y * width + x) * 4;
        const alpha = data[offset + 3];
        if (alpha === 0) continue;

        redTotal += data[offset];
        greenTotal += data[offset + 1];
        blueTotal += data[offset + 2];
        count += 1;
      }
    }
  });

  if (!count) {
    return { r: 255, g: 255, b: 255 };
  }

  return {
    r: Math.round(redTotal / count),
    g: Math.round(greenTotal / count),
    b: Math.round(blueTotal / count),
  };
}

function removeEdgeConnectedBackground(
  source: ImageData,
  target: RGB,
  threshold: number,
  softness: number,
) {
  const width = source.width;
  const height = source.height;
  const data = new Uint8ClampedArray(source.data);
  const visited = new Uint8Array(width * height);
  const queue: number[] = [];
  const fade = Math.max(softness, 1);
  const fadeEnd = threshold + fade;
  const seedLimit = threshold + Math.max(6, Math.round(fade * 0.35));

  const tryQueue = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;

    const pixelIndex = y * width + x;
    if (visited[pixelIndex]) return;

    const offset = pixelIndex * 4;
    if (data[offset + 3] === 0) return;

    const distance = colorDistance(data[offset], data[offset + 1], data[offset + 2], target);
    if (distance > fadeEnd) return;

    if (distance <= seedLimit || x === 0 || y === 0 || x === width - 1 || y === height - 1) {
      visited[pixelIndex] = 1;
      queue.push(pixelIndex);
    }
  };

  for (let x = 0; x < width; x += 1) {
    tryQueue(x, 0);
    tryQueue(x, height - 1);
  }

  for (let y = 1; y < height - 1; y += 1) {
    tryQueue(0, y);
    tryQueue(width - 1, y);
  }

  let head = 0;
  while (head < queue.length) {
    const pixelIndex = queue[head];
    head += 1;

    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const offset = pixelIndex * 4;
    const distance = colorDistance(data[offset], data[offset + 1], data[offset + 2], target);

    if (distance <= threshold) {
      data[offset + 3] = 0;
    } else {
      const alpha = ((distance - threshold) / fade) * 255;
      data[offset + 3] = Math.min(data[offset + 3], clamp(Math.round(alpha), 0, 255));
    }

    tryQueue(x + 1, y);
    tryQueue(x - 1, y);
    tryQueue(x, y + 1);
    tryQueue(x, y - 1);
    tryQueue(x + 1, y + 1);
    tryQueue(x + 1, y - 1);
    tryQueue(x - 1, y + 1);
    tryQueue(x - 1, y - 1);
  }

  return new ImageData(data, width, height);
}

export default function BackgroundRemover() {
  const inputRef = useRef<HTMLInputElement>(null);
  const jobRef = useRef(0);
  const [originalUrl, setOriginalUrl] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [fileName, setFileName] = useState('asset');
  const [threshold, setThreshold] = useState(44);
  const [softness, setSoftness] = useState(26);
  const [targetColor, setTargetColor] = useState('#ffffff');
  const [detectedColor, setDetectedColor] = useState('#f8fafc');
  const [colorMode, setColorMode] = useState<'auto' | 'manual'>('auto');
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [originalUrl, outputUrl]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    setError('');

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    setOriginalUrl(URL.createObjectURL(file));
    setOutputUrl('');
    setFileName(file.name.replace(/\.[^.]+$/, '') || 'asset');
  };

  const processImage = useCallback(async () => {
    if (!originalUrl) return;

    const currentJob = jobRef.current + 1;
    jobRef.current = currentJob;
    setProcessing(true);
    setError('');

    try {
      const image = await loadImage(originalUrl);
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        throw new Error('Canvas is not available in this browser.');
      }

      context.drawImage(image, 0, 0);

      const source = context.getImageData(0, 0, canvas.width, canvas.height);
      const sampled = detectBackgroundColor(source.data, canvas.width, canvas.height);
      const sampledHex = rgbToHex(sampled);
      setDetectedColor((current) => (current === sampledHex ? current : sampledHex));

      const effectiveTarget = colorMode === 'auto' ? sampled : hexToRgb(targetColor);
      const processed = removeEdgeConnectedBackground(source, effectiveTarget, threshold, softness);
      context.putImageData(processed, 0, 0);

      const blob = await canvasToBlob(canvas, 'image/png');
      const nextUrl = URL.createObjectURL(blob);

      if (currentJob !== jobRef.current) {
        URL.revokeObjectURL(nextUrl);
        return;
      }

      setOutputUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return nextUrl;
      });
    } catch (processingError) {
      if (currentJob !== jobRef.current) return;

      setOutputUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return '';
      });
      setError(processingError instanceof Error ? processingError.message : 'Background removal failed.');
    } finally {
      if (currentJob === jobRef.current) {
        setProcessing(false);
      }
    }
  }, [colorMode, originalUrl, softness, targetColor, threshold]);

  useEffect(() => {
    if (!originalUrl) return undefined;

    const timeout = window.setTimeout(() => {
      void processImage();
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [originalUrl, processImage]);

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        This version removes background pixels that are connected to the outer edges of the image, so light details inside the subject stay much safer than a plain global color delete.
      </div>

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
            event.currentTarget.value = '';
          }}
        />
        <div className="text-4xl">✂️</div>
        <p className="mt-4 font-semibold text-slate-900 dark:text-white">Drop an image here or click to browse</p>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">PNG, JPG, WebP. Preview updates automatically after upload or slider changes.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Original</p>
              {originalUrl && (
                <button type="button" onClick={() => void processImage()} className="btn-secondary px-4 py-2 text-xs">
                  {processing ? 'Refreshing...' : 'Refresh preview'}
                </button>
              )}
            </div>
            <div className="flex min-h-[320px] items-center justify-center rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
              {originalUrl ? (
                <img src={originalUrl} alt="Original upload" className="max-h-[320px] w-full object-contain" />
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">Upload an image to start.</p>
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Transparent export</p>
              {outputUrl && (
                <a href={outputUrl} download={`${fileName}-transparent.png`} className="btn-primary px-4 py-2 text-xs">
                  Download PNG
                </a>
              )}
            </div>
            <div className="flex min-h-[320px] items-center justify-center rounded-[22px] border border-slate-200 bg-[linear-gradient(45deg,#f5f5f5_25%,transparent_25%,transparent_75%,#f5f5f5_75%,#f5f5f5),linear-gradient(45deg,#f5f5f5_25%,transparent_25%,transparent_75%,#f5f5f5_75%,#f5f5f5)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] p-4 dark:border-slate-800 dark:bg-[linear-gradient(45deg,#1f2937_25%,transparent_25%,transparent_75%,#1f2937_75%,#1f2937),linear-gradient(45deg,#1f2937_25%,transparent_25%,transparent_75%,#1f2937_75%,#1f2937)]">
              {outputUrl ? (
                <img src={outputUrl} alt="Background removed result" className="max-h-[320px] w-full object-contain" />
              ) : processing ? (
                <p className="text-sm text-slate-400 dark:text-slate-500">Preparing transparent preview...</p>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">The transparent result appears here.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Detection mode</p>
            <div className="mt-3 flex gap-2 rounded-[18px] bg-slate-100 p-1 dark:bg-slate-900/70">
              {([
                ['auto', 'Auto detect'],
                ['manual', 'Manual color'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setColorMode(value)}
                  className={`flex-1 rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
                    colorMode === value
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Active background tone</p>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                {colorMode === 'auto' ? 'Auto' : 'Manual'}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div
                className="h-12 w-16 rounded-xl border border-slate-200 shadow-sm dark:border-slate-700"
                style={{ backgroundColor: colorMode === 'auto' ? detectedColor : targetColor }}
              />

              {colorMode === 'manual' ? (
                <>
                  <input
                    type="color"
                    value={targetColor}
                    onChange={(event) => setTargetColor(event.target.value)}
                    className="h-12 w-16 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={targetColor}
                    onChange={(event) => setTargetColor(event.target.value)}
                    className="flex-1 rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </>
              ) : (
                <div className="flex-1 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                  {detectedColor}
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {['#ffffff', '#f4f1ea', '#dbe4ee', '#0f172a'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setColorMode('manual');
                    setTargetColor(value);
                  }}
                  className="h-9 w-9 rounded-full border border-white/60 shadow-sm"
                  style={{ backgroundColor: value }}
                  aria-label={`Set target color ${value}`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Threshold</p>
              <span className="text-sm text-slate-400 dark:text-slate-500">{threshold}</span>
            </div>
            <input
              type="range"
              min="8"
              max="140"
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="mt-3 w-full accent-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Edge softness</p>
              <span className="text-sm text-slate-400 dark:text-slate-500">{softness}</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={softness}
              onChange={(event) => setSoftness(Number(event.target.value))}
              className="mt-3 w-full accent-brand-500"
            />
          </div>

          {error && (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
            Auto mode samples the outer corners first, then only removes matching pixels that are connected to the image edges. For product shots this is usually much more accurate than deleting every light pixel in the frame.
          </div>
        </div>
      </div>
    </div>
  );
}
