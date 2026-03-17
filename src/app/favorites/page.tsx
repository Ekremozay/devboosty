'use client';
// src/app/favorites/page.tsx

import { useFavorites } from '@/hooks/useFavorites';
import { getToolBySlug } from '@/lib/tools-registry';
import ToolCard from '@/components/ui/ToolCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const tools = favorites.map(slug => getToolBySlug(slug)).filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-2">
          ♥ Your Favorites
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {tools.length > 0
            ? `${tools.length} saved tool${tools.length > 1 ? 's' : ''} — click the heart on any tool to add more.`
            : 'No favorites yet. Browse tools and click the ♥ to save them here.'}
        </p>
      </div>

      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">No favorites yet</p>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Browse our tools and click the heart icon to save your favorites here.</p>
          <Link href="/tools" className="btn-primary">
            Browse All Tools
          </Link>
        </div>
      )}
    </div>
  );
}
