import { defineRouting } from 'next-intl/routing'

import { DEFAULT_APP_LOCALE, SUPPORTED_APP_LOCALES } from '@/constants'

const routing = defineRouting({
  locales: SUPPORTED_APP_LOCALES,
  defaultLocale: DEFAULT_APP_LOCALE,
  localeDetection: false,
})

export { routing }
