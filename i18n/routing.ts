import { defineRouting } from 'next-intl/routing'

import { LOCALES } from '@/utils/constants/currency'

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'us',
})
