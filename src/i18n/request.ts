import { getRequestConfig } from 'next-intl/server';
import { DEFAULT_LOCALE, DEFAULT_TIME_ZONE } from './config';

export default getRequestConfig(async () => {
  const locale = DEFAULT_LOCALE;
  return {
    locale,
    timeZone: DEFAULT_TIME_ZONE,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
