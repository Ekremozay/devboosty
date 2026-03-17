// src/app/tools/[category]/[tool]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { getAllTools, getToolBySlug, getRelatedTools, getToolsByCategory } from '@/lib/tools-registry';
import { generateMetadata as genMeta, generateToolSchema, generateFAQSchema, SITE_URL_EXPORT } from '@/lib/seo';
import FAQSection from '@/components/ui/FAQSection';
import RelatedTools from '@/components/ui/RelatedTools';
import { AdBanner, StickyMobileAd } from '@/components/layout/AdBanner';
import ToolLoader from './ToolLoader';

interface PageProps {
  params: { category: string; tool: string };
}

// ── Static params for SSG ────────────────────────────────────────────────────
export async function generateStaticParams() {
  return getAllTools().map(t => ({ category: t.category, tool: t.slug }));
}

// ── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.tool);
  if (!tool) return {};
  return genMeta({
    title: tool.metaTitle,
    description: tool.metaDescription,
    path: `/tools/${tool.category}/${tool.slug}`,
  });
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ToolPage({ params }: PageProps) {
  const tool = getToolBySlug(params.tool);
  if (!tool || tool.category !== params.category) notFound();

  const related = getRelatedTools(tool);
  const toolUrl = `${SITE_URL_EXPORT}/tools/${tool.category}/${tool.slug}`;

  const toolSchema = generateToolSchema({ name: tool.name, description: tool.description, url: toolUrl });
  const faqSchema = tool.faq?.length ? generateFAQSchema(tool.faq) : null;

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL_EXPORT },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL_EXPORT}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.category.charAt(0).toUpperCase() + tool.category.slice(1), item: `${SITE_URL_EXPORT}/tools/${tool.category}` },
      { '@type': 'ListItem', position: 4, name: tool.name, item: toolUrl },
    ],
  };

  return (
    <>
      {/* Structured data */}
      <Script id="tool-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <Script id="breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <Script id="faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
          <a href="/" className="hover:text-slate-600 transition-colors">Home</a>
          <span>/</span>
          <a href="/tools" className="hover:text-slate-600 transition-colors">Tools</a>
          <span>/</span>
          <a href={`/tools/${tool.category}`} className="hover:text-slate-600 transition-colors capitalize">{tool.category}</a>
          <span>/</span>
          <span className="text-slate-600 font-medium">{tool.name}</span>
        </nav>

        {/* Top Ad */}
        <AdBanner slot="TOP_BANNER_SLOT" format="leaderboard" className="mb-8 h-24" label="Advertisement" />

        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
              {tool.icon}
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                {tool.h1}
              </h1>
              <p className="text-slate-500 mt-2 text-base max-w-2xl leading-relaxed">
                {tool.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className={`text-xs font-semibold border px-3 py-1 rounded-full capitalize chip-${tool.category}`}>
                  {tool.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free · No signup · 100% browser-based
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tool UI */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <ToolLoader component={tool.component} />
        </div>

        {/* Bottom Ad */}
        <AdBanner slot="BOTTOM_BANNER_SLOT" format="leaderboard" className="mt-8 h-24" label="Advertisement" />

        {/* FAQ */}
        {tool.faq && tool.faq.length > 0 && <FAQSection faqs={tool.faq} />}

        {/* Related Tools */}
        <RelatedTools tools={related} currentSlug={tool.slug} />

        {/* How-to section for SEO */}
        <section className="mt-16 bg-slate-50 rounded-2xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
            About {tool.name}
          </h2>
          <div className="prose-blog">
            <p>{tool.description}</p>
            <p className="mt-3">
              This tool works entirely in your browser — no server uploads, no account required.
              Your data stays on your device at all times.
            </p>
          </div>
        </section>
      </div>

      {/* Mobile sticky ad */}
      <StickyMobileAd />
    </>
  );
}
