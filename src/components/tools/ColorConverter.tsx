'use client';
// src/components/tools/ColorConverter.tsx
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/useToast';

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

// ── Converters ─────────────────────────────────────────────────────────────

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.substring(0, 2), 16),
    g: parseInt(full.substring(2, 4), 16),
    b: parseInt(full.substring(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = max === rn ? (gn - bn) / d + (gn < bn ? 6 : 0)
        : max === gn ? (bn - rn) / d + 2
        : (rn - gn) / d + 4;
  h /= 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const hue = h / 360, sat = s / 100, lit = l / 100;
  if (sat === 0) {
    const v = Math.round(lit * 255);
    return { r: v, g: v, b: v };
  }
  const q = lit < 0.5 ? lit * (1 + sat) : lit + sat - lit * sat;
  const p = 2 * lit - q;
  const hue2rgb = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: Math.round(hue2rgb(hue + 1 / 3) * 255),
    g: Math.round(hue2rgb(hue) * 255),
    b: Math.round(hue2rgb(hue - 1 / 3) * 255),
  };
}

function isValidRgb(r: number, g: number, b: number) {
  return [r, g, b].every(v => !isNaN(v) && v >= 0 && v <= 255);
}

function isValidHsl(h: number, s: number, l: number) {
  return !isNaN(h) && h >= 0 && h <= 360 && !isNaN(s) && s >= 0 && s <= 100 && !isNaN(l) && l >= 0 && l <= 100;
}

const PRESET_COLORS = [
  '#0ea5e9', '#0284c7', '#f97316', '#10b981', '#8b5cf6',
  '#ef4444', '#f59e0b', '#06b6d4', '#64748b', '#0f172a',
];

export default function ColorConverter() {
  const [hex, setHex] = useState('#0ea5e9');
  const [rgb, setRgb] = useState<RGB>({ r: 14, g: 165, b: 233 });
  const [hsl, setHsl] = useState<HSL>({ h: 199, s: 89, l: 48 });
  const [error, setError] = useState('');

  const syncFromHex = useCallback((hexVal: string) => {
    const cleaned = hexVal.startsWith('#') ? hexVal : '#' + hexVal;
    setHex(cleaned);
    setError('');
    const parsed = hexToRgb(cleaned);
    if (parsed) {
      setRgb(parsed);
      setHsl(rgbToHsl(parsed));
    } else if (cleaned.length > 1) {
      setError('Invalid HEX color');
    }
  }, []);

  const syncFromRgb = useCallback((r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setError('');
    if (isValidRgb(r, g, b)) {
      const h = rgbToHex({ r, g, b });
      setHex(h);
      setHsl(rgbToHsl({ r, g, b }));
    }
  }, []);

  const syncFromHsl = useCallback((h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    setError('');
    if (isValidHsl(h, s, l)) {
      const rgbVal = hslToRgb({ h, s, l });
      setRgb(rgbVal);
      setHex(rgbToHex(rgbVal));
    }
  }, []);

  const copy = (value: string, label: string) => {
    navigator.clipboard.writeText(value).then(() => toast(`Copied ${label}!`));
  };

  const CopyRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 px-4 py-3">
      <div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">{label}</div>
        <div className="font-mono text-sm text-slate-800 dark:text-slate-200 font-semibold">{value}</div>
      </div>
      <button onClick={() => copy(value, label)} className="btn-ghost text-xs">Copy</button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Color preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-24 h-24 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 flex-shrink-0"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1">
          <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{hex.toUpperCase()}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            hsl({hsl.h}°, {hsl.s}%, {hsl.l}%)
          </div>
          {/* Color picker */}
          <input
            type="color"
            value={hex.length === 7 ? hex : '#000000'}
            onChange={e => syncFromHex(e.target.value)}
            className="mt-2 w-10 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
            title="Pick a color"
          />
        </div>
      </div>

      {/* Preset palette */}
      <div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-2">Quick presets</div>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map(c => (
            <button
              key={c}
              onClick={() => syncFromHex(c)}
              className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
              style={{ backgroundColor: c, borderColor: hex === c ? '#fff' : 'transparent' }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* HEX input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">HEX</label>
        <input
          type="text"
          value={hex}
          onChange={e => syncFromHex(e.target.value)}
          placeholder="#0ea5e9"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* RGB inputs */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">RGB</label>
        <div className="grid grid-cols-3 gap-2">
          {(['r', 'g', 'b'] as const).map((channel, i) => (
            <div key={channel}>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-1 text-center">{['Red', 'Green', 'Blue'][i]}</div>
              <input
                type="number"
                min={0} max={255}
                value={rgb[channel]}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  const newRgb = { ...rgb, [channel]: isNaN(v) ? 0 : v };
                  syncFromRgb(newRgb.r, newRgb.g, newRgb.b);
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2.5 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* HSL inputs */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">HSL</label>
        <div className="grid grid-cols-3 gap-2">
          {(['h', 's', 'l'] as const).map((channel, i) => (
            <div key={channel}>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-1 text-center">
                {['Hue (0-360)', 'Sat (0-100)', 'Light (0-100)'][i]}
              </div>
              <input
                type="number"
                min={0} max={[360, 100, 100][i]}
                value={hsl[channel]}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  const newHsl = { ...hsl, [channel]: isNaN(v) ? 0 : v };
                  syncFromHsl(newHsl.h, newHsl.s, newHsl.l);
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2.5 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-300">
          ⚠ {error}
        </div>
      )}

      {/* Copy values */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">Copy values</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <CopyRow label="HEX" value={hex.toUpperCase()} />
          <CopyRow label="HEX (no #)" value={hex.replace('#', '').toUpperCase()} />
          <CopyRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
          <CopyRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          <CopyRow label="Tailwind-style" value={`${rgb.r} ${rgb.g} ${rgb.b}`} />
          <CopyRow label="CSS var" value={`--color: ${hex.toUpperCase()};`} />
        </div>
      </div>
    </div>
  );
}
