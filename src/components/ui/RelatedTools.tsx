// src/components/ui/RelatedTools.tsx
import Link from 'next/link';
import type { Tool } from '@/lib/tools-registry';

export default function RelatedTools({ tools, currentSlug }: { tools: Tool[]; currentSlug: string }) {
  const filtered = tools.filter(t => t.slug !== currentSlug).slice(0, 4);
  if (!filtered.length) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((tool, i) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.category}/${tool.slug}`}
            className="tool-card group flex flex-col gap-2 animate-fade-in"
            style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
          >
            <div className="text-2xl">{tool.icon}</div>
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-sm">
                {tool.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{tool.tagline}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
