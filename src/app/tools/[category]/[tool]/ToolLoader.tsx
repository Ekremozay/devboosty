'use client';
// src/app/tools/[category]/[tool]/ToolLoader.tsx
// Dynamically imports tool components to keep initial bundle small.
// Add new tools here as you create them.

import dynamic from 'next/dynamic';

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  JSONFormatter:         dynamic(() => import('@/components/tools/JSONFormatter'),        { loading: () => <ToolSkeleton /> }),
  JSONMinify:            dynamic(() => import('@/components/tools/JSONMinify'),            { loading: () => <ToolSkeleton /> }),
  Base64Tool:            dynamic(() => import('@/components/tools/Base64Tool'),            { loading: () => <ToolSkeleton /> }),
  HTMLViewer:            dynamic(() => import('@/components/tools/HTMLViewer'),            { loading: () => <ToolSkeleton /> }),
  HTMLFormatter:         dynamic(() => import('@/components/tools/HTMLFormatter'),         { loading: () => <ToolSkeleton /> }),
  URLEncoderDecoder:     dynamic(() => import('@/components/tools/URLEncoderDecoder'),     { loading: () => <ToolSkeleton /> }),
  JWTDecoder:            dynamic(() => import('@/components/tools/JWTDecoder'),            { loading: () => <ToolSkeleton /> }),
  RegexTester:           dynamic(() => import('@/components/tools/RegexTester'),           { loading: () => <ToolSkeleton /> }),
  WordCounter:           dynamic(() => import('@/components/tools/WordCounter'),           { loading: () => <ToolSkeleton /> }),
  CaseConverter:         dynamic(() => import('@/components/tools/CaseConverter'),         { loading: () => <ToolSkeleton /> }),
  RemoveLineBreaks:      dynamic(() => import('@/components/tools/RemoveLineBreaks'),      { loading: () => <ToolSkeleton /> }),
  TextSorter:            dynamic(() => import('@/components/tools/TextSorter'),            { loading: () => <ToolSkeleton /> }),
  DuplicateLineRemover:  dynamic(() => import('@/components/tools/DuplicateLineRemover'),  { loading: () => <ToolSkeleton /> }),
  MetaTagGenerator:      dynamic(() => import('@/components/tools/MetaTagGenerator'),      { loading: () => <ToolSkeleton /> }),
  KeywordDensity:        dynamic(() => import('@/components/tools/KeywordDensity'),        { loading: () => <ToolSkeleton /> }),
  SlugGenerator:         dynamic(() => import('@/components/tools/SlugGenerator'),         { loading: () => <ToolSkeleton /> }),
  RobotsTxtGenerator:    dynamic(() => import('@/components/tools/RobotsTxtGenerator'),   { loading: () => <ToolSkeleton /> }),
  ImageCompressor:       dynamic(() => import('@/components/tools/ImageCompressor'),       { loading: () => <ToolSkeleton /> }),
  ImageConverter:        dynamic(() => import('@/components/tools/ImageConverter'),        { loading: () => <ToolSkeleton /> }),
  ImageResizer:          dynamic(() => import('@/components/tools/ImageResizer'),          { loading: () => <ToolSkeleton /> }),
  PDFMerge:              dynamic(() => import('@/components/tools/PDFMerge'),              { loading: () => <ToolSkeleton /> }),
  PDFSplit:              dynamic(() => import('@/components/tools/PDFSplit'),              { loading: () => <ToolSkeleton /> }),
  PDFCompressor:         dynamic(() => import('@/components/tools/PDFCompressor'),         { loading: () => <ToolSkeleton /> }),
  PDFToWord:             dynamic(() => import('@/components/tools/PDFToWord'),             { loading: () => <ToolSkeleton /> }),
  UnitConverter:         dynamic(() => import('@/components/tools/UnitConverter'),         { loading: () => <ToolSkeleton /> }),
};

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
