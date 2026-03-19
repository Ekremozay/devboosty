'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';
import { DEFAULT_LOCALE, DEFAULT_TIME_ZONE, LOCALES, isRtlLocale, type Locale } from '@/i18n/config';

export type { Locale } from '@/i18n/config';

interface LocaleContextType {
  locale: Locale;
  changeLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: DEFAULT_LOCALE,
  changeLocale: () => {},
});

export function useLocaleContext() {
  return useContext(LocaleContext);
}

const messagesCache: Record<string, object> = { en: enMessages };

async function loadMessages(locale: Locale): Promise<object> {
  if (messagesCache[locale]) return messagesCache[locale];
  const msgs = await import(`../../messages/${locale}.json`);
  messagesCache[locale] = msgs.default;
  return msgs.default;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<object>(enMessages);

  useEffect(() => {
    const saved = (localStorage.getItem('locale') || DEFAULT_LOCALE) as Locale;
    const safeLocale = LOCALES.includes(saved) ? saved : DEFAULT_LOCALE;
    if (safeLocale !== DEFAULT_LOCALE) {
      loadMessages(safeLocale).then((msgs) => {
        setLocale(safeLocale);
        setMessages(msgs);
        applyDir(safeLocale);
      });
    }
  }, []);

  const applyDir = (l: Locale) => {
    const dir = isRtlLocale(l) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = l;
  };

  const changeLocale = useCallback(async (newLocale: Locale) => {
    const msgs = await loadMessages(newLocale);
    setLocale(newLocale);
    setMessages(msgs);
    localStorage.setItem('locale', newLocale);
    applyDir(newLocale);
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={DEFAULT_TIME_ZONE}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
