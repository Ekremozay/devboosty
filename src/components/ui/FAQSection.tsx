// src/components/ui/FAQSection.tsx

interface FAQ {
  q: string;
  a: string;
}

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  if (!faqs.length) return null;

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-800 text-base">{faq.q}</span>
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 group-open:bg-brand-50 flex items-center justify-center text-slate-500 group-open:text-brand-600 transition-colors text-lg leading-none">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:block">−</span>
              </span>
            </summary>
            <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
