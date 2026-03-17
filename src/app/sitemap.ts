// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllTools, CATEGORIES } from '@/lib/tools-registry';
import type { ToolCategory } from '@/lib/tools-registry';
import { getAllBlogPosts } from '@/lib/blog-registry';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://toolhub.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = getAllTools();
  const posts = getAllBlogPosts();
  const categories = Object.keys(CATEGORIES) as ToolCategory[];
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${BASE_URL}/tools/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = tools.map(tool => ({
    url: `${BASE_URL}/tools/${tool.category}/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: tool.popular ? 0.9 : 0.7,
  }));

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...toolPages, ...blogPages];
}
