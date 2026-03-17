// src/app/tools/page.tsx
import type { Metadata } from 'next';
import { getAllTools, CATEGORIES } from '@/lib/tools-registry';
import type { ToolCategory } from '@/lib/tools-registry';
import ToolCard from '@/components/ui/ToolCard';
import { AdBanner } from '@/components/layout/AdBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Free Online Tools – Developer, SEO, Image, PDF & More',
  description: 'Browse all free online tools: JSON formatter, image compressor, PDF merger, word counter, and 30+ more. No signup, 100% browser-based.',
};

export default function AllToolsPage() {
  const tools = getAllTools();
  const categories = Object.keys(CATEGORIES) as ToolCategory[];
  const popular = tools.filter(t => t.popular);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-slate-900">All Free Online Tools</h1>
        <p className="text-slate-500 mt-2 text-lg">{tools.length} tools · Free · No signup · 100% browser-based</p>
      </div>

      <AdBanner slot="TOOLS_TOP" format="leaderboard" className="mb-10 h-24" />

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/tools" className="px-4 py-1.5 rounded-full bg-brand-600 text-white text-sm font-medium">All</Link>
        {categories.map(cat => (
          <Link key={cat} href={`/tools/${cat}`}
            className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors capitalize">
            {CATEGORIES[cat].icon} {CATEGORIES[cat].name}
          </Link>
        ))}
      </div>

      {/* Popular */}
      {popular.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-amber-500">⭐</span> Most Popular
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popular.map((tool, i) => <ToolCard key={tool.slug} tool={tool} index={i} />)}
          </div>
        </section>
      )}

      {/* By category */}
      {categories.map(cat => {
        const catTools = tools.filter(t => t.category === cat);
        return (
          <section key={cat} className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold text-slate-800 flex items-center gap-2">
                {CATEGORIES[cat].icon} {CATEGORIES[cat].name}
              </h2>
              <Link href={`/tools/${cat}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {catTools.map((tool, i) => <ToolCard key={tool.slug} tool={tool} index={i} />)}
            </div>
          </section>
        );
      })}

      <AdBanner slot="TOOLS_BOTTOM" format="leaderboard" className="mt-4 h-24" />
    </div>
  );
}
