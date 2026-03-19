import type { Metadata } from 'next';
import MultiToolWorkspace from '@/components/workspace/MultiToolWorkspace';

export const metadata: Metadata = {
  title: 'Multi-Tool Workspace – Combine Developer Tools in One Screen',
  description: 'Open multiple built-in developer tools side by side in a single browser-based workspace. Ideal for repeat workflows and fast context switching.',
};

export default function WorkspacePage() {
  return <MultiToolWorkspace />;
}
