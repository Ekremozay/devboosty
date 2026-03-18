'use client';
// src/components/ui/FavoriteButton.tsx
import { useTranslations } from 'next-intl';
import { useFavorites } from '@/hooks/useFavorites';
import { toast } from '@/hooks/useToast';

interface FavoriteButtonProps {
  slug: string;
  name: string;
}

export default function FavoriteButton({ slug, name }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const t = useTranslations('tool');
  const faved = isFavorite(slug);

  function handleClick() {
    toggleFavorite(slug);
    toast(faved ? `Removed "${name}" from favorites` : `Added "${name}" to favorites`, faved ? 'info' : 'success');
  }

  return (
    <button
      onClick={handleClick}
      title={faved ? t('saved') : t('save')}
      aria-label={faved ? t('saved') : t('save')}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
        faved
          ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-400'
          : 'bg-white border-slate-200 text-slate-500 hover:border-rose-200 hover:text-rose-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:border-rose-700'
      }`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={faved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {faved ? t('saved') : t('save')}
    </button>
  );
}
