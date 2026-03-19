'use client';

import { useMemo, useState } from 'react';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): RGB | null {
  const normalized = hex.replace('#', '');
  const full = normalized.length === 3
    ? normalized.split('').map((value) => value + value).join('')
    : normalized;

  if (!/^[0-9a-f]{6}$/i.test(full)) return null;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(lightness * 100) };
  }

  const diff = max - min;
  const saturation = lightness > 0.5 ? diff / (2 - max - min) : diff / (max + min);
  let hue = 0;

  if (max === red) hue = (green - blue) / diff + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / diff + 2;
  else hue = (red - green) / diff + 4;

  return {
    h: Math.round((hue / 6) * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const hue = h / 360;
  const saturation = s / 100;
  const lightness = l / 100;

  if (saturation === 0) {
    const value = Math.round(lightness * 255);
    return { r: value, g: value, b: value };
  }

  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;

  const hueToRgb = (offset: number) => {
    let temp = offset;
    if (temp < 0) temp += 1;
    if (temp > 1) temp -= 1;
    if (temp < 1 / 6) return p + (q - p) * 6 * temp;
    if (temp < 1 / 2) return q;
    if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
    return p;
  };

  return {
    r: Math.round(hueToRgb(hue + 1 / 3) * 255),
    g: Math.round(hueToRgb(hue) * 255),
    b: Math.round(hueToRgb(hue - 1 / 3) * 255),
  };
}

function createPalette(base: HSL) {
  return [94, 86, 76, 66, 56, 46, 36, 26, 18].map((lightness, index) => {
    const swatch = hslToRgb({
      h: base.h,
      s: Math.max(18, Math.min(100, base.s - (index < 3 ? 24 - index * 6 : 0))),
      l: lightness,
    });

    return {
      step: [50, 100, 200, 300, 400, 500, 600, 700, 900][index],
      hex: rgbToHex(swatch).toUpperCase(),
      rgb: swatch,
    };
  });
}

const PRESETS = ['#0EA5E9', '#14B8A6', '#F97316', '#F43F5E', '#6366F1', '#0F172A'];

export default function ColorConverter() {
  const [hex, setHex] = useState('#0EA5E9');
  const [rgb, setRgb] = useState<RGB>({ r: 14, g: 165, b: 233 });
  const [hsl, setHsl] = useState<HSL>({ h: 199, s: 89, l: 48 });
  const [error, setError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  const palette = useMemo(() => createPalette(hsl), [hsl]);

  const syncFromHex = (nextHex: string) => {
    const normalized = nextHex.startsWith('#') ? nextHex : `#${nextHex}`;
    setHex(normalized);

    const parsed = hexToRgb(normalized);
    if (!parsed) {
      setError('Invalid HEX color');
      return;
    }

    setError('');
    setRgb(parsed);
    setHsl(rgbToHsl(parsed));
  };

  const syncFromRgb = (nextRgb: RGB) => {
    setRgb(nextRgb);

    if ([nextRgb.r, nextRgb.g, nextRgb.b].some((value) => Number.isNaN(value) || value < 0 || value > 255)) {
      setError('RGB values must stay between 0 and 255');
      return;
    }

    setError('');
    setHex(rgbToHex(nextRgb).toUpperCase());
    setHsl(rgbToHsl(nextRgb));
  };

  const syncFromHsl = (nextHsl: HSL) => {
    setHsl(nextHsl);

    if (
      Number.isNaN(nextHsl.h) || nextHsl.h < 0 || nextHsl.h > 360 ||
      Number.isNaN(nextHsl.s) || nextHsl.s < 0 || nextHsl.s > 100 ||
      Number.isNaN(nextHsl.l) || nextHsl.l < 0 || nextHsl.l > 100
    ) {
      setError('HSL values must stay in range');
      return;
    }

    setError('');
    const nextRgb = hslToRgb(nextHsl);
    setRgb(nextRgb);
    setHex(rgbToHex(nextRgb).toUpperCase());
  };

  const copy = (value: string, key: string) => {
    void navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1800);
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center gap-4">
            <div
              className="h-24 w-24 rounded-[24px] border border-slate-200 shadow-lg dark:border-slate-700"
              style={{ backgroundColor: hex }}
            />
            <div>
              <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">{hex.toUpperCase()}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
              <input
                type="color"
                value={hex.length === 7 ? hex : '#000000'}
                onChange={(event) => syncFromHex(event.target.value)}
                className="mt-3 h-10 w-14 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                title="Pick a color"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Quick presets</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => syncFromHex(preset)}
                  className="h-10 w-10 rounded-full border border-white/50 shadow-sm"
                  style={{ backgroundColor: preset }}
                  aria-label={`Use preset color ${preset}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">HEX</label>
            <input
              type="text"
              value={hex}
              onChange={(event) => syncFromHex(event.target.value)}
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm font-mono text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="#0EA5E9"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">RGB</label>
            <div className="grid grid-cols-3 gap-2">
              {(['r', 'g', 'b'] as const).map((channel) => (
                <input
                  key={channel}
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[channel]}
                  onChange={(event) => {
                    const value = parseInt(event.target.value, 10);
                    syncFromRgb({ ...rgb, [channel]: Number.isNaN(value) ? 0 : value });
                  }}
                  className="rounded-[18px] border border-slate-200 bg-white px-3 py-3 text-center text-sm font-mono text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">HSL</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                ['h', 360],
                ['s', 100],
                ['l', 100],
              ] as const).map(([channel, max]) => (
                <input
                  key={channel}
                  type="number"
                  min={0}
                  max={max}
                  value={hsl[channel]}
                  onChange={(event) => {
                    const value = parseInt(event.target.value, 10);
                    syncFromHsl({ ...hsl, [channel]: Number.isNaN(value) ? 0 : value });
                  }}
                  className="rounded-[18px] border border-slate-200 bg-white px-3 py-3 text-center text-sm font-mono text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Generated palette</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use the scale for UI states, backgrounds, and semantic design tokens.</p>
              </div>
              <button type="button" onClick={() => copy(palette.map((item) => `${item.step}: ${item.hex}`).join('\n'), 'palette')} className="btn-secondary px-4 py-2 text-xs">
                {copiedKey === 'palette' ? '✓ Copied' : 'Copy scale'}
              </button>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {palette.map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => copy(item.hex, `shade ${item.step}`)}
                  className="overflow-hidden rounded-[20px] border border-slate-200 text-left transition-transform hover:-translate-y-0.5 dark:border-slate-800"
                >
                  <div className="h-24 w-full" style={{ backgroundColor: item.hex }} />
                  <div className="bg-white/95 px-4 py-3 dark:bg-slate-950/90">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{item.step}</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-white">{item.hex}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ['HEX', hex.toUpperCase()],
              ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
              ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
              ['CSS variable', `--brand-color: ${hex.toUpperCase()};`],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-[20px] border border-slate-200 bg-white/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">{label as string}</p>
                    <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900 dark:text-white">{value as string}</p>
                  </div>
                  <button type="button" onClick={() => copy(value as string, label as string)} className="btn-ghost rounded-xl px-3 py-1.5 text-xs">
                    {copiedKey === label ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
