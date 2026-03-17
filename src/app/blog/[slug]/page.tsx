// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { getAllBlogPosts, getBlogPost } from '@/lib/blog-registry';
import { getToolBySlug } from '@/lib/tools-registry';
import { generateMetadata as genMeta, generateBlogSchema, SITE_URL_EXPORT } from '@/lib/seo';
import { AdBanner } from '@/components/layout/AdBanner';

interface PageProps { params: { slug: string } }

export async function generateStaticParams() {
  return getAllBlogPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return genMeta({ title: post.metaTitle, description: post.metaDescription, path: `/blog/${post.slug}` });
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const relatedTool = post.relatedTool ? getToolBySlug(post.relatedTool) : null;
  const schema = generateBlogSchema({ title: post.title, description: post.metaDescription, url: `${SITE_URL_EXPORT}/blog/${post.slug}`, publishDate: post.publishDate });

  return (
    <>
      <Script id="blog-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
          <a href="/" className="hover:text-slate-600">Home</a><span>/</span>
          <a href="/blog" className="hover:text-slate-600">Blog</a><span>/</span>
          <span className="text-slate-600 font-medium line-clamp-1">{post.title}</span>
        </nav>

        <AdBanner slot="BLOG_TOP_SLOT" format="leaderboard" className="mb-8 h-24" />

        {/* Hero */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 px-3 py-1 rounded-full capitalize">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">{post.readingTime} min read</span>
            <span className="text-xs text-slate-400">·</span>
            <time dateTime={post.publishDate} className="text-xs text-slate-400">
              {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-900 leading-tight">{post.title}</h1>
          <p className="text-slate-500 mt-3 text-lg leading-relaxed">{post.excerpt}</p>
        </header>

        {/* Related tool CTA */}
        {relatedTool && (
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-brand-800 text-sm">Try our free {relatedTool.name}</p>
              <p className="text-brand-600 text-xs mt-0.5">{relatedTool.tagline}</p>
            </div>
            <Link href={`/tools/${relatedTool.category}/${relatedTool.slug}`}
              className="btn-primary text-xs flex-shrink-0">
              {relatedTool.icon} Open Tool
            </Link>
          </div>
        )}

        {/* Blog content */}
        <article className="prose-blog">
          {post.content.map((section, i) => {
            switch (section.type) {
              case 'h2': return <h2 key={i}>{section.content as string}</h2>;
              case 'h3': return <h3 key={i}>{section.content as string}</h3>;
              case 'p': return <p key={i}>{section.content as string}</p>;
              case 'ul': return <ul key={i}>{(section.content as string[]).map((item, j) => <li key={j}>{item}</li>)}</ul>;
              case 'ol': return <ol key={i}>{(section.content as string[]).map((item, j) => <li key={j}>{item}</li>)}</ol>;
              case 'code': return <pre key={i}><code>{section.content as string}</code></pre>;
              default: return null;
            }
          })}
        </article>

        <AdBanner slot="BLOG_BOTTOM_SLOT" format="leaderboard" className="mt-10 h-24" />

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-slate-100">
          <Link href="/blog" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    </>
  );
}
