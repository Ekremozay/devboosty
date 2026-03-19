'use client';

import { useTranslations } from 'next-intl';

interface FAQ {
  q: string;
  a: string;
}

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const t = useTranslations('ui');
  if (!faqs.length) return null;

  return (
    <section className="dashboard-panel mt-6 px-5 py-5 sm:px-6">
      <span className="dashboard-badge">{t('needToKnow')}</span>
      <h2 className="mt-3 font-display text-2xl font-bold text-slate-950 dark:text-white">{t('faq')}</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white/80 shadow-sm dark:border-slate-800 dark:bg-slate-950/80"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 select-none transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/70">
              <span className="text-base font-semibold text-slate-900 dark:text-white">{faq.q}</span>
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors group-open:bg-brand-50 group-open:text-brand-600 dark:bg-slate-800 dark:text-slate-400 dark:group-open:bg-brand-500/12 dark:group-open:text-brand-200">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:block">−</span>
              </span>
            </summary>
            <div className="border-t border-slate-200 px-6 pb-5 pt-3 text-sm leading-relaxed text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
