import type { Metadata } from 'next';
import ToolsExplorer from '@/components/workspace/ToolsExplorer';

export const metadata: Metadata = {
  title: 'Developer Tools Library – Search, Filter & Launch Built-In Utilities',
  description: 'Browse the DevBoosty developer tools library with workspace categories, trending picks, and newly added built-in utilities.',
};

interface AllToolsPageProps {
  searchParams?: {
    q?: string;
    workspace?: string;
    mode?: string;
  };
}

export default function AllToolsPage({ searchParams }: AllToolsPageProps) {
  return (
    <ToolsExplorer
      initialQuery={searchParams?.q ?? ''}
      initialWorkspaceCategory={searchParams?.workspace ?? ''}
      initialMode={searchParams?.mode ?? 'all'}
    />
  );
}
