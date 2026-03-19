export const DEFAULT_LOCALE = 'en' as const;
export const LOCALES = ['en', 'tr', 'ar', 'de'] as const;
export const RTL_LOCALES = ['ar'] as const;
export const DEFAULT_TIME_ZONE = 'UTC';

export type Locale = (typeof LOCALES)[number];

export function isRtlLocale(locale: Locale) {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}
