import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import RecentToolTracker from '@/components/ui/RecentToolTracker';
import ToolPageContent from '@/components/ui/ToolPageContent';
import { WORKSPACE_CATEGORIES, getAllTools, getRelatedTools, getToolBySlug } from '@/lib/tools-registry';
import { SITE_URL_EXPORT, generateFAQSchema, generateMetadata as genMeta, generateToolSchema } from '@/lib/seo';

interface PageProps {
  params: { category: string; tool: string };
}

export async function generateStaticParams() {
  return getAllTools().map((tool) => ({ category: tool.category, tool: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.tool);
  if (!tool) return {};

  return genMeta({
    title: tool.metaTitle,
    description: tool.metaDescription,
    path: `/tools/${tool.category}/${tool.slug}`,
  });
}

export default function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.tool);
  if (!tool || tool.category !== params.category) notFound();

  const related = getRelatedTools(tool);
  const toolUrl = `${SITE_URL_EXPORT}/tools/${tool.category}/${tool.slug}`;
  const workspaceInfo = WORKSPACE_CATEGORIES[tool.workspaceCategory];

  const toolSchema = generateToolSchema({ name: tool.name, description: tool.description, url: toolUrl });
  const faqSchema = tool.faq?.length ? generateFAQSchema(tool.faq) : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL_EXPORT },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL_EXPORT}/tools` },
      {
        '@type': 'ListItem',
        position: 3,
        name: workspaceInfo.name,
        item: `${SITE_URL_EXPORT}/tools?workspace=${tool.workspaceCategory}`,
      },
      { '@type': 'ListItem', position: 4, name: tool.name, item: toolUrl },
    ],
  };

  return (
    <>
      <Script id="tool-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <RecentToolTracker slug={tool.slug} />

      <ToolPageContent
        tool={tool}
        related={related}
        workspaceInfo={{ name: workspaceInfo.name, shortName: workspaceInfo.shortName, badgeClassName: workspaceInfo.badgeClassName }}
      />
    </>
  );
}
