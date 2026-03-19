'use client';
// src/app/tools/[category]/[tool]/ToolLoader.tsx
// Dynamically imports tool components to keep initial bundle small.
// Add new tools here as you create them.

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import ToolErrorBoundary from '@/components/ui/ToolErrorBoundary';

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

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  JSONFormatter:         dynamic(() => import('@/components/tools/JSONFormatter'),        { loading: () => <ToolSkeleton />, ssr: false }),
  JSONMinify:            dynamic(() => import('@/components/tools/JSONMinify'),            { loading: () => <ToolSkeleton />, ssr: false }),
  Base64Tool:            dynamic(() => import('@/components/tools/Base64Tool'),            { loading: () => <ToolSkeleton />, ssr: false }),
  HTMLViewer:            dynamic(() => import('@/components/tools/HTMLViewer'),            { loading: () => <ToolSkeleton />, ssr: false }),
  HTMLFormatter:         dynamic(() => import('@/components/tools/HTMLFormatter'),         { loading: () => <ToolSkeleton />, ssr: false }),
  URLEncoderDecoder:     dynamic(() => import('@/components/tools/URLEncoderDecoder'),     { loading: () => <ToolSkeleton />, ssr: false }),
  JWTDecoder:            dynamic(() => import('@/components/tools/JWTDecoder'),            { loading: () => <ToolSkeleton />, ssr: false }),
  RegexTester:           dynamic(() => import('@/components/tools/RegexTester'),           { loading: () => <ToolSkeleton />, ssr: false }),
  WordCounter:           dynamic(() => import('@/components/tools/WordCounter'),           { loading: () => <ToolSkeleton />, ssr: false }),
  CaseConverter:         dynamic(() => import('@/components/tools/CaseConverter'),         { loading: () => <ToolSkeleton />, ssr: false }),
  RemoveLineBreaks:      dynamic(() => import('@/components/tools/RemoveLineBreaks'),      { loading: () => <ToolSkeleton />, ssr: false }),
  TextSorter:            dynamic(() => import('@/components/tools/TextSorter'),            { loading: () => <ToolSkeleton />, ssr: false }),
  DuplicateLineRemover:  dynamic(() => import('@/components/tools/DuplicateLineRemover'),  { loading: () => <ToolSkeleton />, ssr: false }),
  MetaTagGenerator:      dynamic(() => import('@/components/tools/MetaTagGenerator'),      { loading: () => <ToolSkeleton />, ssr: false }),
  KeywordDensity:        dynamic(() => import('@/components/tools/KeywordDensity'),        { loading: () => <ToolSkeleton />, ssr: false }),
  SlugGenerator:         dynamic(() => import('@/components/tools/SlugGenerator'),         { loading: () => <ToolSkeleton />, ssr: false }),
  RobotsTxtGenerator:    dynamic(() => import('@/components/tools/RobotsTxtGenerator'),   { loading: () => <ToolSkeleton />, ssr: false }),
  ImageCompressor:       dynamic(() => import('@/components/tools/ImageCompressor'),       { loading: () => <ToolSkeleton />, ssr: false }),
  ImageConverter:        dynamic(() => import('@/components/tools/ImageConverter'),        { loading: () => <ToolSkeleton />, ssr: false }),
  ImageResizer:          dynamic(() => import('@/components/tools/ImageResizer'),          { loading: () => <ToolSkeleton />, ssr: false }),
  PDFMerge:              dynamic(() => import('@/components/tools/PDFMerge'),              { loading: () => <ToolSkeleton />, ssr: false }),
  PDFSplit:              dynamic(() => import('@/components/tools/PDFSplit'),              { loading: () => <ToolSkeleton />, ssr: false }),
  PDFCompressor:         dynamic(() => import('@/components/tools/PDFCompressor'),         { loading: () => <ToolSkeleton />, ssr: false }),
  PDFToWord:             dynamic(() => import('@/components/tools/PDFToWord'),             { loading: () => <ToolSkeleton />, ssr: false }),
  UnitConverter:         dynamic(() => import('@/components/tools/UnitConverter'),         { loading: () => <ToolSkeleton />, ssr: false }),
  TimestampConverter:    dynamic(() => import('@/components/tools/TimestampConverter'),    { loading: () => <ToolSkeleton />, ssr: false }),
  CSSMinifier:           dynamic(() => import('@/components/tools/CSSMinifier'),           { loading: () => <ToolSkeleton />, ssr: false }),
  JSMinifier:            dynamic(() => import('@/components/tools/JSMinifier'),            { loading: () => <ToolSkeleton />, ssr: false }),
  ColorConverter:        dynamic(() => import('@/components/tools/ColorConverter'),        { loading: () => <ToolSkeleton />, ssr: false }),
  PasswordGenerator:     dynamic(() => import('@/components/tools/PasswordGenerator'),     { loading: () => <ToolSkeleton />, ssr: false }),
  UUIDGenerator:         dynamic(() => import('@/components/tools/UUIDGenerator'),         { loading: () => <ToolSkeleton />, ssr: false }),
  LoremIpsumGenerator:   dynamic(() => import('@/components/tools/LoremIpsumGenerator'),   { loading: () => <ToolSkeleton />, ssr: false }),
  NumberBaseConverter:   dynamic(() => import('@/components/tools/NumberBaseConverter'),   { loading: () => <ToolSkeleton />, ssr: false }),
  HTMLEntityEncoder:     dynamic(() => import('@/components/tools/HTMLEntityEncoder'),     { loading: () => <ToolSkeleton />, ssr: false }),
  BackgroundRemover:     dynamic(() => import('@/components/tools/BackgroundRemover'),     { loading: () => <ToolSkeleton />, ssr: false }),
  ImageEnhancer:         dynamic(() => import('@/components/tools/ImageEnhancer'),         { loading: () => <ToolSkeleton />, ssr: false }),
  MarkdownPreviewer:     dynamic(() => import('@/components/tools/MarkdownPreviewer'),     { loading: () => <ToolSkeleton />, ssr: false }),
  CodeFormatter:         dynamic(() => import('@/components/tools/CodeFormatter'),         { loading: () => <ToolSkeleton />, ssr: false }),
  DataFormatConverter:   dynamic(() => import('@/components/tools/DataFormatConverter'),   { loading: () => <ToolSkeleton />, ssr: false }),
  DiffChecker:           dynamic(() => import('@/components/tools/DiffChecker'),           { loading: () => <ToolSkeleton />, ssr: false }),
  HashToolkit:           dynamic(() => import('@/components/tools/HashToolkit'),           { loading: () => <ToolSkeleton />, ssr: false }),
  CurlFetchConverter:    dynamic(() => import('@/components/tools/CurlFetchConverter'),    { loading: () => <ToolSkeleton />, ssr: false }),
  QueryParamsParser:     dynamic(() => import('@/components/tools/QueryParamsParser'),     { loading: () => <ToolSkeleton />, ssr: false }),
  ContrastChecker:       dynamic(() => import('@/components/tools/ContrastChecker'),       { loading: () => <ToolSkeleton />, ssr: false }),
  CSSGradientGenerator:  dynamic(() => import('@/components/tools/CSSGradientGenerator'),  { loading: () => <ToolSkeleton />, ssr: false }),
  SVGOptimizer:          dynamic(() => import('@/components/tools/SVGOptimizer'),          { loading: () => <ToolSkeleton />, ssr: false }),
  ImageToBase64:         dynamic(() => import('@/components/tools/ImageToBase64'),         { loading: () => <ToolSkeleton />, ssr: false }),
  AIChatWorkbench:       dynamic(() => import('@/components/tools/AIChatWorkbench'),       { loading: () => <ToolSkeleton />, ssr: false }),
  SpeechToTextTool:      dynamic(() => import('@/components/tools/SpeechToTextTool'),      { loading: () => <ToolSkeleton />, ssr: false }),
  TextToSpeechStudio:    dynamic(() => import('@/components/tools/TextToSpeechStudio'),    { loading: () => <ToolSkeleton />, ssr: false }),
  AIImageGenerator:      dynamic(() => import('@/components/tools/AIImageGenerator'),      { loading: () => <ToolSkeleton />, ssr: false }),
  PackageJsonExplorer:   dynamic(() => import('@/components/tools/PackageJsonExplorer'),   { loading: () => <ToolSkeleton />, ssr: false }),
  CIMatrixBuilder:       dynamic(() => import('@/components/tools/CIMatrixBuilder'),       { loading: () => <ToolSkeleton />, ssr: false }),
  PromptTemplateBuilder: dynamic(() => import('@/components/tools/PromptTemplateBuilder'), { loading: () => <ToolSkeleton />, ssr: false }),
};

export default function ToolLoader({ component }: { component: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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

  if (!mounted) return <ToolSkeleton />;

  return (
    <ToolErrorBoundary>
      <Component />
    </ToolErrorBoundary>
  );
}
