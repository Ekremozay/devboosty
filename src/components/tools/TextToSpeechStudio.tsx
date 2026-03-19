'use client';

import { useEffect, useState } from 'react';
import { LEMONFOX_AUDIO_FORMATS, LEMONFOX_TTS_LANGUAGES, LEMONFOX_TTS_VOICE_PRESETS } from '@/lib/lemonfox-config';

const SAMPLE_TEXT = 'DevBoosty now includes AI chat, speech, and image generation powered by LemonfoxAI.';
const MAX_CHARS = 4000;

type HistoryEntry = { text: string; voice: string; format: string; url: string };

export default function TextToSpeechStudio() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [language, setLanguage] = useState('en-us');
  const [voice, setVoice] = useState('sarah');
  const [format, setFormat] = useState<(typeof LEMONFOX_AUDIO_FORMATS)[number]>('mp3');
  const [speed, setSpeed] = useState(1);
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!LEMONFOX_TTS_VOICE_PRESETS[language as keyof typeof LEMONFOX_TTS_VOICE_PRESETS]) return;
    const presets = LEMONFOX_TTS_VOICE_PRESETS[language as keyof typeof LEMONFOX_TTS_VOICE_PRESETS] as readonly string[];
    if (!presets.includes(voice)) setVoice(presets[0]);
  }, [language, voice]);

  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  const generateSpeech = async () => {
    if (!input.trim()) { setError('Please enter some text to synthesize.'); return; }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, language, voice, response_format: format, speed }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Speech generation failed.');
      }

      const blob = await response.blob();
      const nextUrl = URL.createObjectURL(blob);
      setAudioUrl(current => { if (current) URL.revokeObjectURL(current); return nextUrl; });
      setHistory(prev => [{ text: input.slice(0, 60) + (input.length > 60 ? '…' : ''), voice, format, url: nextUrl }, ...prev].slice(0, 5));
    } catch (speechError) {
      setError(speechError instanceof Error ? speechError.message : 'Speech generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const voicePresets = (LEMONFOX_TTS_VOICE_PRESETS[language as keyof typeof LEMONFOX_TTS_VOICE_PRESETS] ?? []) as readonly string[];
  const charCount = input.length;
  const overLimit = charCount > MAX_CHARS;

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        Generate downloadable voice output with LemonfoxAI. Choose language, voice preset, speed, and output format. Up to {MAX_CHARS.toLocaleString()} characters per request.
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Controls */}
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {LEMONFOX_TTS_LANGUAGES.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Voice</label>
              <input
                type="text"
                value={voice}
                onChange={e => setVoice(e.target.value)}
                className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {voicePresets.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Voice presets</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {voicePresets.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setVoice(item)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      voice === item
                        ? 'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Format</label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value as (typeof LEMONFOX_AUDIO_FORMATS)[number])}
                className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {LEMONFOX_AUDIO_FORMATS.map(item => (
                  <option key={item} value={item}>{item.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Speed</label>
                <span className="text-sm text-slate-400">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range" min="0.5" max="2" step="0.1" value={speed}
                onChange={e => setSpeed(Number(e.target.value))}
                className="mt-3 w-full accent-brand-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0.5× slow</span><span>2× fast</span>
              </div>
            </div>
          </div>

          <button type="button" onClick={generateSpeech} className="btn-primary w-full" disabled={loading || overLimit}>
            {loading ? 'Generating...' : '🔊 Generate speech'}
          </button>

          {/* Recent history */}
          {history.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 mb-2">Recent</p>
              <div className="space-y-2">
                {history.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-[14px] border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="min-w-0">
                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{entry.text}</p>
                      <p className="text-[10px] text-slate-400">{entry.voice} · {entry.format}</p>
                    </div>
                    <a href={entry.url} download={`speech-${i}.${entry.format}`} className="flex-shrink-0 text-xs btn-ghost py-1 px-2">⬇</a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text + Audio */}
        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Text to convert</label>
              <span className={`text-xs font-mono ${overLimit ? 'text-red-500' : 'text-slate-400'}`}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className={`tool-textarea ${overLimit ? 'border-red-300 focus:ring-red-300' : ''}`}
              style={{ minHeight: 240 }}
              placeholder="Enter the text you want to convert into speech."
            />
            {overLimit && (
              <p className="mt-1 text-xs text-red-500">Exceeds {MAX_CHARS.toLocaleString()} character limit. Please shorten your text.</p>
            )}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Audio preview</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Preview and download the generated voice output.</p>
              </div>
              {audioUrl && (
                <a href={audioUrl} download={`devboosty-voice.${format}`} className="btn-primary px-4 py-2 text-xs">
                  ⬇ Download {format.toUpperCase()}
                </a>
              )}
            </div>

            <div className="rounded-[18px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/80">
              {audioUrl ? (
                <audio controls className="w-full" src={audioUrl}>
                  <track kind="captions" />
                </audio>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">Generated audio will appear here.</p>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
