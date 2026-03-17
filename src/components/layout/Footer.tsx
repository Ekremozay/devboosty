// src/components/layout/Footer.tsx
import Link from 'next/link';
import { CATEGORIES, getAllTools } from '@/lib/tools-registry';
import type { ToolCategory } from '@/lib/tools-registry';

export default function Footer() {
  const popularTools = getAllTools().filter(t => t.popular).slice(0, 6);

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2L4 9h4l-1 5 7-8H10L10 2z" fill="white"/>
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-white">
                Dev<span className="text-brand-400">Boosty</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Free online tools for developers, designers, SEO professionals, and content creators. Fast, secure, no signup required.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2.5">
              {(Object.keys(CATEGORIES) as ToolCategory[]).map(cat => (
                <li key={cat}>
                  <Link
                    href={`/tools/${cat}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {CATEGORIES[cat].icon} {CATEGORIES[cat].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Popular Tools</h3>
            <ul className="space-y-2.5">
              {popularTools.map(tool => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.category}/${tool.slug}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DevBoosty. All tools are free and run in your browser.
          </p>
          <p className="text-xs text-slate-500">
            No signup required · No data sent to servers · Open source friendly
          </p>
        </div>
      </div>
    </footer>
  );
}
