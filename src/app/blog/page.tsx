import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/blog-registry';
import BlogPageContent from '@/components/ui/BlogPageContent';

export const metadata: Metadata = {
  title: 'Blog – Developer Tips, SEO Guides & Tool Tutorials',
  description: 'Free guides on JSON, Base64, image compression, PDF tools, SEO meta tags, and more. Written for developers and content creators.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogPageContent posts={posts} />;
}
