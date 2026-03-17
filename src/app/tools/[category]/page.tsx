// src/app/tools/[category]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getToolsByCategory } from '@/lib/tools-registry';
import type { ToolCategory } from '@/lib/tools-registry';
import { generateMetadata as genMeta } from '@/lib/seo';
import ToolCard from '@/components/ui/ToolCard';
import { AdBanner } from '@/components/layout/AdBanner';

interface PageProps { params: { category: string } }

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map(c => ({ category: c }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cat = CATEGORIES[params.category as ToolCategory];
  if (!cat) return {};
  return genMeta({ title: cat.metaTitle, description: cat.metaDescription, path: `/tools/${params.category}` });
}

export default function CategoryPage({ params }: PageProps) {
  const cat = CATEGORIES[params.category as ToolCategory];
  if (!cat) notFound();
  const tools = getToolsByCategory(params.category as ToolCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <a href="/" className="hover:text-slate-600">Home</a><span>/</span>
        <a href="/tools" className="hover:text-slate-600">Tools</a><span>/</span>
        <span className="text-slate-600 font-medium">{cat.name}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} text-3xl mb-4 shadow-lg`}>
          {cat.icon}
        </div>
        <h1 className="font-display text-4xl font-bold text-slate-900">{cat.name}</h1>
        <p className="text-slate-500 mt-2 text-lg max-w-xl">{cat.description}</p>
        <p className="text-sm text-slate-400 mt-2">{tools.length} free tools · No signup required</p>
      </div>

      <AdBanner slot="CATEGORY_TOP_SLOT" format="leaderboard" className="mb-8 h-24" />

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool, i) => <ToolCard key={tool.slug} tool={tool} index={i} />)}
      </div>

      <AdBanner slot="CATEGORY_BOTTOM_SLOT" format="leaderboard" className="mt-10 h-24" />
    </div>
  );
}
