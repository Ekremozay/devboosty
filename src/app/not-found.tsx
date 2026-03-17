// src/app/not-found.tsx
import Link from 'next/link';
import { getPopularTools } from '@/lib/tools-registry';

export default function NotFound() {
  const popular = getPopularTools().slice(0, 4);
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-8xl mb-6">🔧</div>
      <h1 className="font-display text-5xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-xl text-slate-500 mb-8">This page doesn't exist — but we have {' '}
        <Link href="/tools" className="text-brand-600 hover:underline">30+ free tools</Link> waiting for you.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {popular.map(tool => (
          <Link key={tool.slug} href={`/tools/${tool.category}/${tool.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm">
            {tool.icon} {tool.name}
          </Link>
        ))}
      </div>
      <Link href="/" className="btn-primary text-base px-8 py-3">
        ← Back to Home
      </Link>
    </div>
  );
}
