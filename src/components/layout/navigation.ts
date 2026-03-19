import { getAllBlogPosts, getBlogPost } from '@/lib/blog-registry';
import { CATEGORIES, WORKSPACE_CATEGORIES, getAllTools, getToolBySlug, type ToolCategory, type WorkspaceCategory } from '@/lib/tools-registry';
import type { Locale } from '@/i18n/config';

export interface DashboardLink {
  href: string;
  label: string;
  icon: string;
  description: string;
  match?: 'exact' | 'prefix';
  workspaceCategory?: WorkspaceCategory;
}

export interface DashboardContext {
  eyebrow: string;
  title: string;
  description: string;
  stats: string[];
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  tr: '🇹🇷',
  ar: '🇸🇦',
  de: '🇩🇪',
};

export const WORKSPACE_LINKS: DashboardLink[] = [
  {
    href: '/',
    label: 'Overview',
    icon: '01',
    description: 'Start from the dashboard home.',
    match: 'exact',
  },
  {
    href: '/tools',
    label: 'All tools',
    icon: '02',
    description: 'Search and filter the full library.',
    match: 'prefix',
  },
  {
    href: '/workspace',
    label: 'Workspace',
    icon: '03',
    description: 'Use multiple tools in one view.',
    match: 'exact',
  },
  {
    href: '/favorites',
    label: 'Favorites',
    icon: '04',
    description: 'Keep frequently used tools close.',
    match: 'exact',
  },
  {
    href: '/blog',
    label: 'Blog',
    icon: '05',
    description: 'Guides, tutorials, and tips.',
    match: 'prefix',
  },
];

export const CATEGORY_LINKS: DashboardLink[] = (Object.keys(WORKSPACE_CATEGORIES) as WorkspaceCategory[]).map((category) => ({
  href: `/tools?workspace=${category}`,
  label: WORKSPACE_CATEGORIES[category].name,
  icon: WORKSPACE_CATEGORIES[category].icon,
  description: WORKSPACE_CATEGORIES[category].description,
  match: 'exact',
  workspaceCategory: category,
}));

export function isActivePath(pathname: string, href: string, match: 'exact' | 'prefix' = 'prefix') {
  if (match === 'exact') {
    return pathname === href;
  }

  if (href === '/tools') {
    return pathname === '/tools' || pathname.startsWith('/tools/');
  }

  if (href === '/blog') {
    return pathname === '/blog' || pathname.startsWith('/blog/');
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getDashboardContext(pathname: string): DashboardContext {
  const totalTools = getAllTools().length;
  const categoryCount = Object.keys(WORKSPACE_CATEGORIES).length;
  const blogCount = getAllBlogPosts().length;

  if (pathname === '/') {
    return {
      eyebrow: 'Workspace',
      title: 'DevBoosty overview',
      description: 'A fast, browser-based tool dashboard for formatting, converting, and shipping work without context switching.',
      stats: [`${totalTools} tools`, `${categoryCount} categories`, 'No signup'],
    };
  }

  if (pathname === '/tools') {
    return {
      eyebrow: 'Library',
      title: 'Developer tools library',
      description: 'Browse the full DevBoosty library, filter by developer workflow, and jump into built-in tools quickly.',
      stats: [`${totalTools} tools`, `${Object.keys(WORKSPACE_CATEGORIES).length} workspace categories`, 'Client-side'],
    };
  }

  if (pathname === '/workspace') {
    return {
      eyebrow: 'Workspace',
      title: 'Multi-tool workspace',
      description: 'Run multiple built-in tools side by side for faster repeat workflows and less context switching.',
      stats: ['3 live panels', 'Saved locally', 'Browser-based'],
    };
  }

  if (pathname.startsWith('/tools/')) {
    const segments = pathname.split('/').filter(Boolean);
    const category = segments[1] as ToolCategory | undefined;
    const toolSlug = segments[2];

    if (toolSlug) {
      const tool = getToolBySlug(decodeURIComponent(toolSlug));
      if (tool) {
        return {
          eyebrow: WORKSPACE_CATEGORIES[tool.workspaceCategory].name,
          title: tool.name,
          description: tool.tagline,
          stats: ['Free forever', 'Browser-based', 'Instant output'],
        };
      }
    }

    if (category && CATEGORIES[category]) {
      const categoryTools = getAllTools().filter((tool) => tool.category === category);
      return {
        eyebrow: 'Category',
        title: CATEGORIES[category].name,
        description: CATEGORIES[category].description,
        stats: [`${categoryTools.length} tools`, 'Updated library', 'Free access'],
      };
    }
  }

  if (pathname === '/favorites') {
    return {
      eyebrow: 'Workspace',
      title: 'Saved tools',
      description: 'Keep the tools you return to most in one place for faster daily workflows.',
      stats: ['Personal shortlist', 'Synced locally', 'One-click access'],
    };
  }

  if (pathname === '/blog') {
    return {
      eyebrow: 'Insights',
      title: 'DevBoosty blog',
      description: 'Guides, explainers, and workflow notes connected to the tools in this workspace.',
      stats: [`${blogCount} articles`, 'Practical guides', 'Tool-linked'],
    };
  }

  if (pathname.startsWith('/blog/')) {
    const slug = pathname.split('/').filter(Boolean)[1];
    const post = slug ? getBlogPost(decodeURIComponent(slug)) : undefined;

    if (post) {
      return {
        eyebrow: 'Article',
        title: post.title,
        description: post.excerpt,
        stats: [`${post.readingTime} min read`, post.category, 'Updated guide'],
      };
    }
  }

  return {
    eyebrow: 'DevBoosty',
    title: 'Free online tools',
    description: 'Utility workflows for developers, content teams, and creators, all in a single workspace.',
    stats: [`${totalTools} tools`, `${categoryCount} categories`, 'Always free'],
  };
}
