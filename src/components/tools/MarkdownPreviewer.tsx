'use client';

import { useState } from 'react';

const SAMPLE_MARKDOWN = `# DevBoosty Workspace

Ship quick developer utilities from a single dashboard.

## Highlights

- Fast browser-based tools
- Shared design language
- Multi-tool workflows

> Clean interfaces reduce context switching.

\`\`\`ts
export function formatWorkspace(name: string) {
  return \`Workspace: \${name}\`;
}
\`\`\`

Visit [the tool library](/tools) to explore the rest of the stack.
`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInline(value: string) {
  let formatted = escapeHtml(value);

  formatted = formatted.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label, url) => {
    const safeUrl = /^(https?:\/\/|mailto:|\/)/.test(url) ? url : '#';
    return `<a href="${safeUrl}" target="${safeUrl.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">${label}</a>`;
  });
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return formatted;
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const output: string[] = [];
  let inCodeBlock = false;
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listType) {
      output.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      closeList();
      if (inCodeBlock) {
        output.push('</code></pre>');
      } else {
        output.push('<pre><code>');
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      output.push(`${escapeHtml(line)}\n`);
      continue;
    }

    if (!line.trim()) {
      closeList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      output.push(`<h${level}>${formatInline(heading[2])}</h${level}>`);
      continue;
    }

    const unorderedItem = line.match(/^[-*]\s+(.*)$/);
    if (unorderedItem) {
      if (listType !== 'ul') {
        closeList();
        listType = 'ul';
        output.push('<ul>');
      }
      output.push(`<li>${formatInline(unorderedItem[1])}</li>`);
      continue;
    }

    const orderedItem = line.match(/^\d+\.\s+(.*)$/);
    if (orderedItem) {
      if (listType !== 'ol') {
        closeList();
        listType = 'ol';
        output.push('<ol>');
      }
      output.push(`<li>${formatInline(orderedItem[1])}</li>`);
      continue;
    }

    closeList();

    if (line.startsWith('>')) {
      output.push(`<blockquote><p>${formatInline(line.replace(/^>\s?/, ''))}</p></blockquote>`);
      continue;
    }

    output.push(`<p>${formatInline(line)}</p>`);
  }

  closeList();
  return output.join('');
}

export default function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [mode, setMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [copied, setCopied] = useState(false);

  const preview = renderMarkdown(markdown);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-[18px] bg-slate-100 p-1 dark:bg-slate-900/70">
          {([
            ['split', 'Split view'],
            ['editor', 'Editor'],
            ['preview', 'Preview'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition-colors ${
                mode === value
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMarkdown(SAMPLE_MARKDOWN)} className="btn-secondary px-4 py-2 text-xs">
            Load sample
          </button>
          <button type="button" onClick={() => setMarkdown('')} className="btn-ghost rounded-[18px] border border-slate-200 px-4 py-2 text-xs dark:border-slate-800">
            Clear
          </button>
          <button type="button" onClick={handleCopy} className="btn-primary px-4 py-2 text-xs">
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
        </div>
      </div>

      <div className={`grid gap-4 ${mode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {(mode === 'split' || mode === 'editor') && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Markdown editor</p>
            <textarea
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              spellCheck={false}
              className="tool-textarea font-mono text-[13px] leading-6"
              style={{ minHeight: 420 }}
              placeholder="# Write Markdown here"
            />
          </div>
        )}

        {(mode === 'split' || mode === 'preview') && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Live preview</p>
            <div className="min-h-[420px] rounded-[24px] border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="prose-blog max-w-none" dangerouslySetInnerHTML={{ __html: preview }} />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[20px] border border-slate-200 bg-white/70 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
        Supports headings, lists, blockquotes, fenced code blocks, inline code, emphasis, and links.
      </div>
    </div>
  );
}
