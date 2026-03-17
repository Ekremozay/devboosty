// src/components/ui/ToolCard.tsx
import Link from 'next/link';
import type { Tool } from '@/lib/tools-registry';

const CHIP_CLASSES: Record<string, string> = {
  developer: 'chip-developer',
  text: 'chip-text',
  seo: 'chip-seo',
  image: 'chip-image',
  pdf: 'chip-pdf',
  converter: 'chip-converter',
};

export default function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  return (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      className="tool-card group flex flex-col gap-3 animate-fade-in"
      style={{ animationDelay: `${index * 0.04}s`, opacity: 0 }}
    >
      {/* Icon + badges row */}
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-xl border border-slate-100">
          {tool.icon}
        </div>
        <div className="flex gap-1.5">
          {tool.popular && (
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full">
              Popular
            </span>
          )}
          {tool.new && (
            <span className="text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
      </div>

      {/* Name + tagline */}
      <div>
        <h3 className="font-display font-bold text-slate-800 group-hover:text-brand-600 transition-colors leading-tight">
          {tool.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{tool.tagline}</p>
      </div>

      {/* Category chip */}
      <div className="mt-auto pt-2">
        <span className={`text-[11px] font-medium border px-2.5 py-0.5 rounded-full capitalize ${CHIP_CLASSES[tool.category]}`}>
          {tool.category}
        </span>
      </div>
    </Link>
  );
}
