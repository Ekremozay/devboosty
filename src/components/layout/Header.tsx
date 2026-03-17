'use client';
// src/components/layout/Header.tsx
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/tools-registry';
import type { ToolCategory } from '@/lib/tools-registry';

const NAV_LINKS = [
  { label: 'All Tools', href: '/tools' },
  { label: 'Developer', href: '/tools/developer' },
  { label: 'Text', href: '/tools/text' },
  { label: 'SEO', href: '/tools/seo' },
  { label: 'Image', href: '/tools/image' },
  { label: 'PDF', href: '/tools/pdf' },
  { label: 'Blog', href: '/blog' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm font-display shadow-md group-hover:shadow-brand-200 transition-shadow">
              T
            </div>
            <span className="font-display text-xl font-bold text-slate-900">
              Tool<span className="text-brand-600">Hub</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 rounded-lg hover:text-brand-600 hover:bg-brand-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/tools"
              className="hidden sm:inline-flex btn-primary text-xs"
            >
              All Tools
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-0.5 bg-slate-700 mb-1.5 transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translate(2px, 6px)' : '' }} />
              <div className="w-5 h-0.5 bg-slate-700 mb-1.5 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
              <div className="w-5 h-0.5 bg-slate-700 transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translate(2px, -6px)' : '' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-brand-50 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
