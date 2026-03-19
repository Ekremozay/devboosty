'use client';

import { useState } from 'react';
import { LEMONFOX_CHAT_MODELS } from '@/lib/lemonfox-config';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const STARTER_PROMPTS = [
  'Generate a launch announcement for a new developer tool.',
  'Explain a JSON parsing bug in simple terms.',
  'Write a cleaner API error message for users.',
  'Draft a concise README section for a workspace feature.',
];

function getAssistantText(payload: unknown) {
  const data = payload as {
    choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map((item) => item?.text ?? '').join('\n').trim();
  }

  return '';
}

export default function AIChatWorkbench() {
  const [model, setModel] = useState<(typeof LEMONFOX_CHAT_MODELS)[number]['id']>('llama-70b-chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Ask for prompt help, code explanations, UX copy, changelog drafting, or technical brainstorming.',
    },
  ]);
  const [input, setInput] = useState('Help me write a polished product update for our new developer tools platform.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (nextMessage?: string) => {
    const content = (nextMessage ?? input).trim();
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are DevBoosty AI. Give concise, practical, developer-friendly answers with examples when useful.',
            },
            ...nextMessages,
          ],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Chat request failed.');
      }

      const assistantText = getAssistantText(data);
      if (!assistantText) {
        throw new Error('No assistant response was returned.');
      }

      setMessages((current) => [...current, { role: 'assistant', content: assistantText }]);
    } catch (chatError) {
      setError(chatError instanceof Error ? chatError.message : 'Chat request failed.');
      setMessages(messages);
      setInput(content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        Powered by LemonfoxAI chat completions. Use it for draft generation, explanations, prompt rewrites, UX copy, and quick technical support inside the workspace.
      </div>

      <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">Model</label>
            <select
              value={model}
              onChange={(event) => setModel(event.target.value as (typeof LEMONFOX_CHAT_MODELS)[number]['id'])}
              className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {LEMONFOX_CHAT_MODELS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-slate-500">
              {LEMONFOX_CHAT_MODELS.find((item) => item.id === model)?.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Quick starters</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setInput(prompt);
                    void sendMessage(prompt);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-[22px] border px-4 py-4 ${
                  message.role === 'assistant'
                    ? 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60'
                    : 'border-brand-200 bg-brand-50/70 dark:border-brand-500/30 dark:bg-brand-500/10'
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  {message.role}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="tool-textarea"
              style={{ minHeight: 160 }}
              placeholder="Ask for code help, product copy, workflow prompts, or AI-generated explanations..."
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button type="button" onClick={() => setMessages(messages.slice(0, 1))} className="btn-ghost rounded-[18px] border border-slate-200 px-4 py-2 text-xs dark:border-slate-800">
                Reset chat
              </button>
              <button type="button" onClick={() => void sendMessage()} className="btn-primary px-5 py-2.5 text-sm" disabled={loading}>
                {loading ? 'Thinking...' : 'Send'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
