import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORIES, getToolsByCategory } from '@/lib/tools-registry';
import type { ToolCategory } from '@/lib/tools-registry';
import { generateMetadata as genMeta } from '@/lib/seo';
import CategoryPageContent from '@/components/ui/CategoryPageContent';

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = CATEGORIES[params.category as ToolCategory];
  if (!category) return {};

  return genMeta({
    title: category.metaTitle,
    description: category.metaDescription,
    path: `/tools/${params.category}`,
  });
}

export default function CategoryPage({ params }: PageProps) {
  const category = CATEGORIES[params.category as ToolCategory];
  if (!category) notFound();

  const tools = getToolsByCategory(params.category as ToolCategory);

  return (
    <CategoryPageContent
      category={{ name: category.name, description: category.description, icon: category.icon, color: category.color }}
      categorySlug={params.category}
      tools={tools}
    />
  );
}
