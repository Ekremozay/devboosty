'use client';

import { useState } from 'react';
import { LEMONFOX_IMAGE_SIZES } from '@/lib/lemonfox-config';

type GeneratedImage = {
  url?: string;
  b64_json?: string;
};

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState('A cinematic workstation for a modern developer tools platform, warm lighting, editorial SaaS aesthetic, ultra-detailed.');
  const [negativePrompt, setNegativePrompt] = useState('low quality, blurry, text artifacts, watermark, distorted hands');
  const [size, setSize] = useState<(typeof LEMONFOX_IMAGE_SIZES)[number]>('1024x1024');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const downloadImage = (src: string, index: number) => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `devboosty-image-${index + 1}.png`;
    a.click();
  };

  const generateImages = async () => {
    if (!prompt.trim()) {
      setError('Please describe the image you want to generate.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/image-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          size,
          n: count,
          response_format: 'b64_json',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Image generation failed.');
      }

      const result = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      setImages(result);
    } catch (imageError) {
      setError(imageError instanceof Error ? imageError.message : 'Image generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        Generate concept art, social graphics, thumbnails, product illustrations, or hero visuals with LemonfoxAI image generation.
      </div>

      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Prompt</label>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              className="tool-textarea mt-3"
              style={{ minHeight: 180 }}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Negative prompt</label>
            <textarea
              value={negativePrompt}
              onChange={(event) => setNegativePrompt(event.target.value)}
              className="tool-textarea mt-3"
              style={{ minHeight: 110 }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Size</label>
              <select
                value={size}
                onChange={(event) => setSize(event.target.value as (typeof LEMONFOX_IMAGE_SIZES)[number])}
                className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {LEMONFOX_IMAGE_SIZES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Images</label>
              <input
                type="number"
                min="1"
                max="4"
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <button type="button" onClick={generateImages} className="btn-primary w-full" disabled={loading}>
            {loading ? 'Generating images...' : 'Generate images'}
          </button>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="grid gap-4 md:grid-cols-2">
            {images.length > 0 ? images.map((image, index) => {
              const src = image.url || (image.b64_json ? `data:image/png;base64,${image.b64_json}` : '');
              return (
                <div key={`${src}-${index}`} className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
                  {src ? (
                    <>
                      <img src={src} alt={`Generated visual ${index + 1}`} className="h-[320px] w-full object-cover" />
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                          Result {index + 1}
                        </p>
                        <button type="button" onClick={() => downloadImage(src, index)} className="btn-secondary px-4 py-2 text-xs">
                          ⬇ Download
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              );
            }) : (
              <div className="col-span-full flex min-h-[420px] items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/60">
                <div>
                  <div className="text-4xl">🪄</div>
                  <p className="mt-4 font-semibold text-slate-900 dark:text-white">Generated images will appear here</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Use detailed style cues, camera language, composition hints, and negative prompts for cleaner results.
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
