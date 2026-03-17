'use client';
// src/components/tools/UnitConverter.tsx
// This single component handles cm↔inch, kg↔lbs, and °C↔°F
// The tool slug determines which conversion is shown.

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Conversion = { from: string; to: string; toFn: (v: number) => number; fromFn: (v: number) => number; table: number[]; unit1: string; unit2: string; };

const CONVERSIONS: Record<string, Conversion> = {
  'cm-to-inch': { from: 'Centimeters (cm)', to: 'Inches (in)', unit1: 'cm', unit2: 'in', toFn: v => v * 0.393701, fromFn: v => v / 0.393701, table: [1, 5, 10, 15, 20, 25, 30, 50, 100, 150, 200] },
  'kg-to-lbs': { from: 'Kilograms (kg)', to: 'Pounds (lbs)', unit1: 'kg', unit2: 'lbs', toFn: v => v * 2.20462, fromFn: v => v / 2.20462, table: [1, 5, 10, 20, 30, 50, 60, 70, 80, 90, 100] },
  'celsius-to-fahrenheit': { from: 'Celsius (°C)', to: 'Fahrenheit (°F)', unit1: '°C', unit2: '°F', toFn: v => v * 9/5 + 32, fromFn: v => (v - 32) * 5/9, table: [-40, -20, 0, 10, 20, 30, 37, 50, 60, 80, 100] },
};

export default function UnitConverter() {
  const pathname = usePathname();
  const slug = pathname?.split('/').pop() || 'cm-to-inch';
  const conv = CONVERSIONS[slug] || CONVERSIONS['cm-to-inch'];

  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [dir, setDir] = useState<'forward' | 'reverse'>('forward');

  const handleA = (v: string) => { setA(v); setDir('forward'); setB(v === '' ? '' : conv.toFn(+v).toFixed(4).replace(/\.?0+$/, '')); };
  const handleB = (v: string) => { setB(v); setDir('reverse'); setA(v === '' ? '' : conv.fromFn(+v).toFixed(4).replace(/\.?0+$/, '')); };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {[{ label: conv.from, value: a, onChange: handleA, unit: conv.unit1 }, { label: conv.to, value: b, onChange: handleB, unit: conv.unit2 }].map(({ label, value, onChange, unit }) => (
          <div key={label} className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{label}</label>
            <div className="relative">
              <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder="0"
                className="w-full rounded-xl border border-slate-200 pl-4 pr-16 py-4 text-2xl font-display font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">{unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <h3 className="font-semibold text-sm text-slate-700">Reference Table</h3>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50">
            <th className="px-4 py-2 text-left font-semibold text-slate-600">{conv.unit1}</th>
            <th className="px-4 py-2 text-left font-semibold text-slate-600">{conv.unit2}</th>
          </tr></thead>
          <tbody>
            {conv.table.map((v, i) => (
              <tr key={v} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="px-4 py-2 font-mono text-slate-700">{v} {conv.unit1}</td>
                <td className="px-4 py-2 font-mono text-brand-700 font-semibold">{conv.toFn(v).toFixed(3).replace(/\.?0+$/, '')} {conv.unit2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
