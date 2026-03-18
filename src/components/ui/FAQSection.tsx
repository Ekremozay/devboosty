// src/components/ui/FAQSection.tsx

interface FAQ {
  q: string;
  a: string;
}

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  if (!faqs.length) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="font-semibold text-slate-800 dark:text-slate-100 text-base">{faq.q}</span>
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 group-open:bg-brand-50 dark:group-open:bg-brand-900/50 flex items-center justify-center text-slate-500 dark:text-slate-400 group-open:text-brand-600 dark:group-open:text-brand-400 transition-colors text-lg leading-none">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:block">−</span>
              </span>
            </summary>
            <div className="px-6 pb-5 pt-1 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-50 dark:border-slate-700">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
