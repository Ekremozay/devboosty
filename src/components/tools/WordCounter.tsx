'use client';
// src/components/tools/WordCounter.tsx

import { useState, useMemo } from 'react';

interface Stats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
  uniqueWords: number;
  topWords: [string, number][];
}

const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','it','its','this','that','was','are','be','been','has','have','had','do','does','did','will','would','could','should','may','might','shall','can','i','you','he','she','we','they','me','him','her','us','them','my','your','his','our','their','not','no','as','if','so','than','then','when','where','who','what','which','how','all','any','each','every','some','few','more','most','other','into','out','up','about','after','before','between','through','during','while','although','because','since','until','unless']);

function computeStats(text: string): Stats {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const lines = text.split('\n').length;
  const wordCount = words.length;
  const readingTime = Math.ceil(wordCount / 200);
  const speakingTime = Math.ceil(wordCount / 130);

  const freq: Record<string, number> = {};
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length > 2 && !STOP_WORDS.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });
  const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))).size;

  return {
    words: wordCount,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    lines,
    readingTime,
    speakingTime,
    uniqueWords,
    topWords,
  };
}

const STAT_CARDS = [
  { key: 'words', label: 'Words', icon: '📝', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { key: 'chars', label: 'Characters', icon: '🔤', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { key: 'charsNoSpaces', label: 'Chars (no spaces)', icon: '✂️', color: 'text-violet-600 bg-violet-50 border-violet-100' },
  { key: 'sentences', label: 'Sentences', icon: '💬', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { key: 'paragraphs', label: 'Paragraphs', icon: '¶', color: 'text-rose-600 bg-rose-50 border-rose-100' },
  { key: 'lines', label: 'Lines', icon: '≡', color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
];

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => computeStats(text), [text]);

  const clear = () => setText('');
  const loadSample = () => setText(`The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. It has been used for typing tests and font displays for decades.\n\nWord counters are essential tools for writers, students, and content creators. Whether you're writing a blog post, essay, or social media update, keeping track of your word count helps you stay within limits and meet requirements.`);

  return (
    <div className="space-y-6">
      {/* Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">Your Text</label>
          <div className="flex gap-2">
            <button onClick={loadSample} className="btn-ghost text-xs">Sample</button>
            <button onClick={clear} disabled={!text} className="btn-ghost text-xs disabled:opacity-40">Clear</button>
          </div>
        </div>
        <textarea
          className="tool-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here to count words, characters, sentences, and more..."
          style={{ minHeight: 280 }}
        />
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAT_CARDS.map(({ key, label, icon, color }) => (
          <div key={key} className={`rounded-xl border p-3 text-center ${color}`}>
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-2xl font-display font-bold">
              {stats[key as keyof Stats] as number}
            </div>
            <div className="text-xs font-medium mt-0.5 opacity-80">{label}</div>
          </div>
        ))}
      </div>

      {/* Reading/Speaking time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="text-3xl">📖</div>
          <div>
            <div className="font-display font-bold text-2xl text-slate-800">
              {stats.readingTime < 1 ? '<1' : stats.readingTime} min
            </div>
            <div className="text-sm text-slate-500">Reading time (200 wpm)</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
          <div className="text-3xl">🎙️</div>
          <div>
            <div className="font-display font-bold text-2xl text-slate-800">
              {stats.speakingTime < 1 ? '<1' : stats.speakingTime} min
            </div>
            <div className="text-sm text-slate-500">Speaking time (130 wpm)</div>
          </div>
        </div>
      </div>

      {/* Top keywords */}
      {stats.topWords.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">Top Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {stats.topWords.map(([word, count]) => (
              <span key={word} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-sm">
                <span className="font-medium text-slate-700">{word}</span>
                <span className="text-xs text-slate-400 bg-slate-200 rounded-full px-1.5 py-0.5">{count}</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Unique words: <span className="font-semibold text-slate-600">{stats.uniqueWords}</span>
          </p>
        </div>
      )}

      {/* Social limits */}
      {stats.chars > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">Platform Character Limits</h3>
          <div className="space-y-3">
            {[
              { label: 'Twitter / X', limit: 280, icon: '🐦' },
              { label: 'Instagram caption', limit: 2200, icon: '📸' },
              { label: 'LinkedIn post', limit: 3000, icon: '💼' },
              { label: 'Meta description', limit: 160, icon: '🏷️' },
            ].map(({ label, limit, icon }) => {
              const pct = Math.min(100, (stats.chars / limit) * 100);
              const over = stats.chars > limit;
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{icon} {label}</span>
                    <span className={over ? 'text-red-500 font-semibold' : 'text-slate-500'}>
                      {stats.chars} / {limit} {over ? '(over by ' + (stats.chars - limit) + ')' : ''}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${over ? 'bg-red-400' : pct > 80 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
