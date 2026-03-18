'use client';
// src/components/tools/LoremIpsumGenerator.tsx

import { useState } from 'react';

const WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','eu','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum','curabitur','pretium','tincidunt','lacus','nunc','purus','accumsan','libero','elementum','tristique','diam','nibh','vulputate','risus'];

function randomWords(n: number): string {
  const result: string[] = [];
  for (let i = 0; i < n; i++) {
    result.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return result.join(' ');
}

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  const sentence = randomWords(len);
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  return Array.from({ length: sentenceCount }, generateSentence).join(' ');
}

function generateOutput(type: string, count: number, startWithLorem: boolean): string {
  if (type === 'words') {
    const words = startWithLorem
      ? 'Lorem ipsum dolor sit amet ' + randomWords(Math.max(0, count - 5))
      : randomWords(count);
    return words.trim();
  }
  if (type === 'sentences') {
    const sentences = Array.from({ length: count }, generateSentence);
    if (startWithLorem) sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    return sentences.join(' ');
  }
  // paragraphs
  const paragraphs = Array.from({ length: count }, generateParagraph);
  if (startWithLorem) paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  return paragraphs.join('\n\n');
}

export default function LoremIpsumGenerator() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setOutput(generateOutput(type, count, startWithLorem));
    setCopied(false);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const maxCount = type === 'paragraphs' ? 20 : type === 'sentences' ? 50 : 500;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Generate</label>
          <select
            value={type}
            onChange={e => { setType(e.target.value as typeof type); setCount(type === 'words' ? 50 : 3); }}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        {/* Count */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Amount: <span className="text-brand-600 dark:text-brand-400">{count}</span>
          </label>
          <input
            type="range" min={1} max={maxCount} value={Math.min(count, maxCount)}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full mt-1 accent-brand-600"
          />
        </div>

        {/* Start with Lorem */}
        <div className="flex items-center gap-3 pt-6">
          <button
            onClick={() => setStartWithLorem(!startWithLorem)}
            className={`w-10 h-5 rounded-full transition-colors ${startWithLorem ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span className={`block w-4 h-4 rounded-full bg-white shadow mx-0.5 transition-transform ${startWithLorem ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-300">Start with "Lorem ipsum"</span>
        </div>
      </div>

      <button onClick={generate} className="btn-primary w-full justify-center py-3 text-base">
        ⚡ Generate Lorem Ipsum
      </button>

      {output && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              readOnly
              value={output}
              className="tool-textarea h-72"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={copy} className="btn-primary">
              {copied ? '✓ Copied!' : 'Copy Text'}
            </button>
            <button onClick={() => setOutput('')} className="btn-secondary">
              Clear
            </button>
            <span className="ml-auto text-sm text-slate-400 self-center">
              {output.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
