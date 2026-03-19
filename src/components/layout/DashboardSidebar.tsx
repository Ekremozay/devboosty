'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getAllTools } from '@/lib/tools-registry';
import { CATEGORY_LINKS, WORKSPACE_LINKS, isActivePath } from '@/components/layout/navigation';

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

function SidebarLink({
  href,
  label,
  icon,
  description,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200 ${
        active
          ? 'border-brand-300 bg-brand-50 text-brand-900 shadow-sm dark:border-brand-500/40 dark:bg-brand-500/12 dark:text-brand-100'
          : 'border-transparent bg-transparent text-slate-600 hover:border-slate-300 hover:bg-white/85 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900/40 dark:hover:text-slate-100'
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-semibold transition-colors ${
          active
            ? 'border-brand-200 bg-white text-brand-700 dark:border-brand-400/40 dark:bg-slate-900/70 dark:text-brand-200'
            : 'border-slate-200 bg-white text-slate-500 group-hover:border-brand-200 group-hover:text-brand-700 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400 dark:group-hover:border-brand-500/30 dark:group-hover:text-brand-200'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block truncate text-xs text-slate-400 dark:text-slate-500">{description}</span>
      </span>
    </Link>
  );
}

export default function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const t = useTranslations('sidebar');
  const pathname = usePathname();
  const totalTools = getAllTools().length;
  const [activeWorkspace, setActiveWorkspace] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setActiveWorkspace(new URLSearchParams(window.location.search).get('workspace') ?? '');
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-[rgba(72,45,20,0.26)] backdrop-blur-sm transition-opacity duration-200 xl:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[292px] flex-col border-r border-slate-200/70 bg-[#f8f1e8]/95 px-4 py-4 shadow-2xl backdrop-blur-xl transition-transform duration-300 dark:border-slate-800/80 dark:bg-[#241b14]/95 xl:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="dashboard-panel flex items-center justify-between px-4 py-4">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[22px] bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-base font-black text-brand-950 shadow-lg shadow-brand-500/20">
              DB
            </span>
            <span>
              <span className="block font-display text-xl font-bold text-slate-950 dark:text-white">DevBoosty</span>
              <span className="block text-xs font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                {t('mobileMenu')}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-colors hover:border-brand-200 hover:text-brand-800 dark:border-slate-700 dark:bg-slate-950/70 dark:text-slate-400 dark:hover:border-brand-500/30 dark:hover:text-brand-200"
            aria-label={t('closeNav')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <section className="space-y-3">
            <div className="px-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('workspace')}</p>
            </div>
            <div className="space-y-2">
              {WORKSPACE_LINKS.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  description={link.description}
                  active={isActivePath(pathname, link.href, link.match)}
                  onClick={onClose}
                />
              ))}
            </div>
          </section>

          <section className="mt-7 space-y-3">
            <div className="px-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('categories')}</p>
            </div>
            <div className="space-y-2">
              {CATEGORY_LINKS.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  icon={link.icon}
                  description={link.description}
                  active={pathname === '/tools' && activeWorkspace === link.workspaceCategory}
                  onClick={onClose}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="mt-4">
          <div className="dashboard-panel overflow-hidden px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">{t('quickNote')}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{t('tagline')}</p>
              </div>
              <span className="dashboard-badge">{totalTools}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('description')}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
