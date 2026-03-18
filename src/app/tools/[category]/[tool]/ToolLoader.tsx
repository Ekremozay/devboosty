'use client';
// src/app/tools/[category]/[tool]/ToolLoader.tsx
// Dynamically imports tool components to keep initial bundle small.
// Add new tools here as you create them.

import dynamic from 'next/dynamic';

function ToolSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="skeleton h-64 rounded-xl" />
        <div className="skeleton h-64 rounded-xl" />
      </div>
      <div className="skeleton h-10 w-32 rounded-xl" />
    </div>
  );
}

const opts = { loading: () => <ToolSkeleton />, ssr: false } as const;

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  JSONFormatter:         dynamic(() => import('@/components/tools/JSONFormatter'),        opts),
  JSONMinify:            dynamic(() => import('@/components/tools/JSONMinify'),            opts),
  Base64Tool:            dynamic(() => import('@/components/tools/Base64Tool'),            opts),
  HTMLViewer:            dynamic(() => import('@/components/tools/HTMLViewer'),            opts),
  HTMLFormatter:         dynamic(() => import('@/components/tools/HTMLFormatter'),         opts),
  URLEncoderDecoder:     dynamic(() => import('@/components/tools/URLEncoderDecoder'),     opts),
  JWTDecoder:            dynamic(() => import('@/components/tools/JWTDecoder'),            opts),
  RegexTester:           dynamic(() => import('@/components/tools/RegexTester'),           opts),
  WordCounter:           dynamic(() => import('@/components/tools/WordCounter'),           opts),
  CaseConverter:         dynamic(() => import('@/components/tools/CaseConverter'),         opts),
  RemoveLineBreaks:      dynamic(() => import('@/components/tools/RemoveLineBreaks'),      opts),
  TextSorter:            dynamic(() => import('@/components/tools/TextSorter'),            opts),
  DuplicateLineRemover:  dynamic(() => import('@/components/tools/DuplicateLineRemover'),  opts),
  MetaTagGenerator:      dynamic(() => import('@/components/tools/MetaTagGenerator'),      opts),
  KeywordDensity:        dynamic(() => import('@/components/tools/KeywordDensity'),        opts),
  SlugGenerator:         dynamic(() => import('@/components/tools/SlugGenerator'),         opts),
  RobotsTxtGenerator:    dynamic(() => import('@/components/tools/RobotsTxtGenerator'),   opts),
  ImageCompressor:       dynamic(() => import('@/components/tools/ImageCompressor'),       opts),
  ImageConverter:        dynamic(() => import('@/components/tools/ImageConverter'),        opts),
  ImageResizer:          dynamic(() => import('@/components/tools/ImageResizer'),          opts),
  PDFMerge:              dynamic(() => import('@/components/tools/PDFMerge'),              opts),
  PDFSplit:              dynamic(() => import('@/components/tools/PDFSplit'),              opts),
  PDFCompressor:         dynamic(() => import('@/components/tools/PDFCompressor'),         opts),
  PDFToWord:             dynamic(() => import('@/components/tools/PDFToWord'),             opts),
  UnitConverter:         dynamic(() => import('@/components/tools/UnitConverter'),         opts),
  TimestampConverter:    dynamic(() => import('@/components/tools/TimestampConverter'),    opts),
  CSSMinifier:           dynamic(() => import('@/components/tools/CSSMinifier'),           opts),
  JSMinifier:            dynamic(() => import('@/components/tools/JSMinifier'),            opts),
  ColorConverter:        dynamic(() => import('@/components/tools/ColorConverter'),        opts),
  PasswordGenerator:     dynamic(() => import('@/components/tools/PasswordGenerator'),     opts),
  UUIDGenerator:         dynamic(() => import('@/components/tools/UUIDGenerator'),         opts),
  LoremIpsumGenerator:   dynamic(() => import('@/components/tools/LoremIpsumGenerator'),   opts),
  NumberBaseConverter:   dynamic(() => import('@/components/tools/NumberBaseConverter'),   opts),
  HTMLEntityEncoder:     dynamic(() => import('@/components/tools/HTMLEntityEncoder'),     opts),
};

export default function ToolLoader({ component }: { component: string }) {
  const Component = TOOL_COMPONENTS[component];
  if (!Component) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="text-5xl mb-4">🔧</div>
        <p className="font-semibold text-slate-600">Tool coming soon!</p>
        <p className="text-sm mt-2">We&apos;re building this tool. Check back shortly.</p>
      </div>
    );
  }
  return <Component />;
}
