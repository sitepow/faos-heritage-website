import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

type SupportedLocale = (typeof routing.locales)[number]

type MessageLoader = () => Promise<{ default: Record<string, unknown> }>

const MESSAGE_LOADERS: Record<SupportedLocale, MessageLoader> = {
  th: () => import('@/constants/localization/thailand.json'),
  us: () => import('@/constants/localization/unitedstates.json'),
  gr: () => import('@/constants/localization/greece.json'),
  it: () => import('@/constants/localization/italy.json'),
  nl: () => import('@/constants/localization/netherlands.json'),
  my: () => import('@/constants/localization/malaysia.json'),
  sg: () => import('@/constants/localization/singapore.json'),
  jp: () => import('@/constants/localization/japan.json'),
  cn: () => import('@/constants/localization/china.json'),
  is: () => import('@/constants/localization/iceland.json'),
  vn: () => import('@/constants/localization/vietnam.json'),
  id: () => import('@/constants/localization/indonesia.json'),
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale

  const locale: SupportedLocale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale

  const loadMessages =
    MESSAGE_LOADERS[locale] ?? MESSAGE_LOADERS[routing.defaultLocale]

  const messages = (await loadMessages()).default

  return {
    locale,
    messages,
  }
})
