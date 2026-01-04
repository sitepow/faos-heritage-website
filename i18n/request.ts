import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

const messages = {
  us: () => import('@/messages/us.json'),
  th: () => import('@/messages/th.json'),
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale

  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await messages[locale as keyof typeof messages]()).default,
  }
})
