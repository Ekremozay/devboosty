// src/app/blog/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllBlogPosts } from '@/lib/blog-registry';
import { CATEGORIES } from '@/lib/tools-registry';
import type { ToolCategory } from '@/lib/tools-registry';

export const metadata: Metadata = {
  title: 'Blog – Developer Tips, SEO Guides & Tool Tutorials',
  description: 'Free guides on JSON, Base64, image compression, PDF tools, SEO meta tags, and more. Written for developers and content creators.',
};

const CATEGORY_COLORS: Record<string, string> = {
  developer: 'bg-blue-50 text-blue-700 border-blue-100',
  seo: 'bg-orange-50 text-orange-700 border-orange-100',
  image: 'bg-purple-50 text-purple-700 border-purple-100',
  pdf: 'bg-red-50 text-red-700 border-red-100',
  text: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-slate-900">Blog</h1>
        <p className="text-slate-500 mt-2 text-lg">Guides, tutorials, and tips on tools, SEO, and development.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, i) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="tool-card group flex flex-col gap-3 animate-fade-in"
            style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold border px-2.5 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[post.category] || 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                {post.category}
              </span>
              <span className="text-xs text-slate-400">{post.readingTime} min read</span>
            </div>
            <h2 className="font-display font-bold text-slate-800 group-hover:text-brand-600 transition-colors text-lg leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-slate-500 line-clamp-2 flex-1">{post.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-50">
              <span>{new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-brand-500 group-hover:text-brand-700 font-medium">Read more →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
