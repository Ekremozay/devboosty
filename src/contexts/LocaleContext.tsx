'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '../../messages/en.json';

export type Locale = 'en' | 'tr' | 'ar' | 'de';

const LOCALES: Locale[] = ['en', 'tr', 'ar', 'de'];
const RTL_LOCALES: Locale[] = ['ar'];

interface LocaleContextType {
  locale: Locale;
  changeLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
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
  const [locale, setLocale] = useState<Locale>('en');
  const [messages, setMessages] = useState<object>(enMessages);

  useEffect(() => {
    const saved = (localStorage.getItem('locale') || 'en') as Locale;
    const safeLocale = LOCALES.includes(saved) ? saved : 'en';
    if (safeLocale !== 'en') {
      loadMessages(safeLocale).then((msgs) => {
        setLocale(safeLocale);
        setMessages(msgs);
        applyDir(safeLocale);
      });
    }
  }, []);

  const applyDir = (l: Locale) => {
    const dir = RTL_LOCALES.includes(l) ? 'rtl' : 'ltr';
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
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}
