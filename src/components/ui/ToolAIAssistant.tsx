'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type ToolAIAssistantProps = {
  toolName: string;
  description: string;
  workspaceName: string;
};

function getAssistantText(payload: unknown) {
  const data = payload as {
    choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map((item) => item?.text ?? '').join('\n').trim();
  return '';
}

export default function ToolAIAssistant({ toolName, description, workspaceName }: ToolAIAssistantProps) {
  const t = useTranslations('aiAssistant');
  const QUICK_ACTIONS = [t('action1'), t('action2'), t('action3'), t('action4')];
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAssistant = async (nextQuestion?: string) => {
    const prompt = (nextQuestion ?? question).trim();
    if (!prompt || loading) return;

    setQuestion(prompt);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-70b-chat',
          messages: [
            {
              role: 'system',
              content: `You are the DevBoosty assistant. The user is on the "${toolName}" page in the "${workspaceName}" workspace. Tool description: ${description}. Give practical guidance, examples, troubleshooting help, and workflow suggestions. Keep answers concise and action-oriented.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(t('errorFailed'));
        return;
      }

      const text = getAssistantText(data);
      if (!text) {
        setError(t('errorEmpty'));
        return;
      }

      setAnswer(text);
    } catch {
      setError(t('errorFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-panel px-5 py-5">
      <span className="dashboard-badge">{t('badge')}</span>
      <h2 className="mt-3 font-display text-2xl font-bold text-slate-950 dark:text-white">{t('title')}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {t('description', { toolName })}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => void askAssistant(item)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-300 dark:hover:border-brand-500/30 dark:hover:text-brand-200"
          >
            {item}
          </button>
        ))}
      </div>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        className="tool-textarea mt-5"
        style={{ minHeight: 150 }}
        placeholder={t('placeholder', { toolName })}
      />

      <div className="mt-3 flex justify-end">
        <button type="button" onClick={() => void askAssistant()} className="btn-primary px-5 py-2.5 text-sm" disabled={loading}>
          {loading ? t('thinking') : t('ask')}
        </button>
      </div>

      {answer && (
        <div className="mt-4 rounded-[22px] border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">{t('answer')}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">{answer}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}
    </section>
  );
}
