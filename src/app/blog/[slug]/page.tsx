import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPost } from '@/lib/blog-registry';
import { getToolBySlug } from '@/lib/tools-registry';
import { SITE_URL_EXPORT, generateBlogSchema, generateMetadata as genMeta } from '@/lib/seo';
import BlogPostContent from '@/components/ui/BlogPostContent';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  return genMeta({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const relatedTool = post.relatedTool ? getToolBySlug(post.relatedTool) : null;
  const schema = generateBlogSchema({
    title: post.title,
    description: post.metaDescription,
    url: `${SITE_URL_EXPORT}/blog/${post.slug}`,
    publishDate: post.publishDate,
  });

  return (
    <>
      <Script id="blog-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <BlogPostContent post={post} relatedTool={relatedTool ?? null} />
    </>
  );
}
