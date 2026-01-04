import { defineRouting } from 'next-intl/routing'

import { LOCALES } from '@/utils/constants'

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'us',
})
