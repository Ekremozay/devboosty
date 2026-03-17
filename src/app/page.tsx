// src/app/page.tsx
import Link from 'next/link';
import { getPopularTools, getAllTools, CATEGORIES } from '@/lib/tools-registry';
import type { ToolCategory } from '@/lib/tools-registry';
import ToolCard from '@/components/ui/ToolCard';
import { AdBanner } from '@/components/layout/AdBanner';

export default function HomePage() {
  const popular = getPopularTools();
  const allTools = getAllTools();
  const categories = Object.keys(CATEGORIES) as ToolCategory[];

  const stats = [
    { value: `${allTools.length}+`, label: 'Free Tools' },
    { value: '100%', label: 'Browser-Based' },
    { value: '0', label: 'Sign-ups Needed' },
    { value: '∞', label: 'Uses Per Day' },
  ];

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-brand-950 to-slate-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Free · No signup · Browser-based
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              Every tool you need,{' '}
              <span className="gradient-text">completely free</span>
            </h1>

            <p className="mt-6 text-xl text-slate-300 leading-relaxed">
              {allTools.length}+ online tools for developers, designers, and content creators.
              Format JSON, compress images, merge PDFs, and more — all in your browser.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/tools" className="btn-primary text-base px-8 py-3.5 text-lg rounded-2xl">
                Browse All Tools
              </Link>
              <Link href="/tools/developer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-white/20 text-white/90 hover:bg-white/10 transition-all text-base font-semibold">
                Developer Tools →
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                <div className="font-display text-3xl font-bold text-white">{value}</div>
                <div className="text-sm text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Ad ────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <AdBanner slot="HOME_TOP_SLOT" format="leaderboard" className="h-24" />
      </div>

      {/* ── Popular Tools ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-slate-900">Most Popular Tools</h2>
            <p className="text-slate-500 mt-1">Used by thousands of developers and creators daily</p>
          </div>
          <Link href="/tools" className="text-sm text-brand-600 hover:text-brand-700 font-semibold hidden sm:block">
            View all {allTools.length} tools →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {popular.map((tool, i) => <ToolCard key={tool.slug} tool={tool} index={i} />)}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">Browse by Category</h2>
          <p className="text-slate-500 mb-8">Organized into {categories.length} categories covering all your needs</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat, i) => {
              const info = CATEGORIES[cat];
              const tools = allTools.filter(t => t.category === cat);
              return (
                <Link key={cat} href={`/tools/${cat}`}
                  className="group bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} text-2xl shadow-md mb-4`}>
                    {info.icon}
                  </div>
                  <h3 className="font-display font-bold text-slate-800 group-hover:text-brand-600 transition-colors text-xl">{info.name}</h3>
                  <p className="text-slate-500 text-sm mt-1.5">{info.description}</p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400 font-medium">{tools.length} tools</span>
                    <span className="text-xs text-brand-500 ml-auto group-hover:translate-x-0.5 transition-transform">Browse →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Middle Ad ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AdBanner slot="HOME_MID_SLOT" format="rectangle" className="h-64 max-w-md mx-auto" />
      </div>

      {/* ── Why ToolHub ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-2 text-center">Why ToolHub?</h2>
        <p className="text-slate-500 text-center mb-10">Simple, fast, and respects your privacy</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔒', title: 'Privacy First', desc: 'All tools run in your browser. Your data never leaves your device or gets uploaded to any server.' },
            { icon: '⚡', title: 'Instant Results', desc: 'No waiting, no loading spinners. Client-side processing means instant output as you type.' },
            { icon: '🆓', title: 'Always Free', desc: 'Every tool is completely free with no usage limits. No paywalls, no sign-ups required.' },
            { icon: '📱', title: 'Works Everywhere', desc: 'Fully responsive on desktop, tablet, and mobile. Use it from any device, any browser.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="text-center p-6">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-display font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
