'use client';

import { useState, useRef } from 'react';
import { LEMONFOX_STT_RESPONSE_FORMATS } from '@/lib/lemonfox-config';

type VerboseSegment = { id: number; start: number; end: number; text: string };

function formatResult(payload: unknown, format: string): { plain: string; segments?: VerboseSegment[] } {
  if (format === 'verbose_json') {
    const data = payload as { text?: string; segments?: VerboseSegment[] };
    return { plain: data.text ?? '', segments: data.segments };
  }
  const data = payload as { text?: string; segments?: Array<{ text?: string }> };
  if (typeof data.text === 'string' && data.text.trim()) return { plain: data.text };
  if (Array.isArray(data.segments)) return { plain: data.segments.map(s => s.text ?? '').join(' ').trim() };
  return { plain: JSON.stringify(payload, null, 2) };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function SpeechToTextTool() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [language, setLanguage] = useState('');
  const [responseFormat, setResponseFormat] = useState<(typeof LEMONFOX_STT_RESPONSE_FORMATS)[number]>('json');
  const [speakerLabels, setSpeakerLabels] = useState(false);
  const [output, setOutput] = useState('');
  const [segments, setSegments] = useState<VerboseSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0;

  const setAudioFile = (f: File) => {
    setFile(f);
    setOutput('');
    setSegments([]);
    setError('');
  };

  const transcribe = async () => {
    if (!file && !audioUrl.trim()) {
      setError('Upload an audio file or provide a public audio URL.');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');
    setSegments([]);

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (audioUrl.trim()) formData.append('audioUrl', audioUrl.trim());
      if (language.trim()) formData.append('language', language.trim());
      formData.append('response_format', responseFormat);
      formData.append('speaker_labels', speakerLabels ? 'true' : 'false');

      const response = await fetch('/api/ai/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Transcription failed.');

      const { plain, segments: segs } = formatResult(data, responseFormat);
      setOutput(plain);
      if (segs) setSegments(segs);
    } catch (transcriptionError) {
      setError(transcriptionError instanceof Error ? transcriptionError.message : 'Transcription failed.');
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadAs = (ext: string, mimeType: string) => {
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFile(null);
    setAudioUrl('');
    setOutput('');
    setSegments([]);
    setError('');
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        Transcribe audio files or public URLs with LemonfoxAI. Supports timestamps, speaker labels, and multiple export formats.
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Left panel — controls */}
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          {/* Audio file upload with drag & drop */}
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Audio file</label>
            <label
              className={`mt-3 flex cursor-pointer flex-col items-center rounded-[24px] border-2 border-dashed px-5 py-8 text-center transition-colors ${
                dragging
                  ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'border-slate-200 bg-slate-50 hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900/60'
              }`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault(); setDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f && f.type.startsWith('audio/')) setAudioFile(f);
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setAudioFile(f); }}
              />
              <div className="text-3xl">🎙️</div>
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                {file ? file.name : 'Drop or choose an audio file'}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                MP3, WAV, M4A, OGG · Drag & drop supported
              </p>
              {file && (
                <p className="mt-1 text-xs text-brand-500">{(file.size / 1024).toFixed(0)} KB</p>
              )}
            </label>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Or public audio URL</label>
            <input
              type="text"
              value={audioUrl}
              onChange={e => setAudioUrl(e.target.value)}
              className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="https://example.com/audio.mp3"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Language hint</label>
              <input
                type="text"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="tr, en, de, ar..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Format</label>
              <select
                value={responseFormat}
                onChange={e => setResponseFormat(e.target.value as (typeof LEMONFOX_STT_RESPONSE_FORMATS)[number])}
                className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {LEMONFOX_STT_RESPONSE_FORMATS.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            <input
              type="checkbox"
              checked={speakerLabels}
              onChange={e => setSpeakerLabels(e.target.checked)}
              className="h-4 w-4 accent-brand-500"
            />
            Speaker labels (diarization)
          </label>

          <div className="flex gap-2">
            <button type="button" onClick={transcribe} className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Transcribing...' : '🎙️ Transcribe'}
            </button>
            {(file || audioUrl || output) && (
              <button type="button" onClick={clearAll} className="btn-ghost px-4">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right panel — output */}
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Transcript</p>
              {output && (
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {wordCount.toLocaleString()} words · {output.length.toLocaleString()} chars
                </p>
              )}
            </div>
            {output && (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={copy} className="btn-secondary px-3 py-1.5 text-xs">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
                <button type="button" onClick={() => downloadAs('txt', 'text/plain')} className="btn-secondary px-3 py-1.5 text-xs">
                  ⬇ .txt
                </button>
                {(responseFormat === 'srt' || responseFormat === 'vtt') && (
                  <button type="button" onClick={() => downloadAs(responseFormat, 'text/plain')} className="btn-secondary px-3 py-1.5 text-xs">
                    ⬇ .{responseFormat}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Timestamps view for verbose_json */}
          {segments.length > 0 ? (
            <div className="space-y-1 max-h-[460px] overflow-y-auto rounded-[18px] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
              {segments.map(seg => (
                <div key={seg.id} className="flex gap-3 rounded-[12px] px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/60">
                  <span className="flex-shrink-0 text-xs font-mono text-brand-500 dark:text-brand-400 mt-0.5">
                    {formatTime(seg.start)} → {formatTime(seg.end)}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-200">{seg.text}</span>
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              spellCheck={false}
              className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
              style={{ minHeight: 460 }}
              placeholder="Transcript will appear here. Choose verbose_json for timestamps."
            />
          )}

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
