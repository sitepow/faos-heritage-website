import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

type SupportedLocale = (typeof routing.locales)[number]

type MessageLoader = () => Promise<{ default: Record<string, unknown> }>

const MESSAGE_LOADERS: Record<SupportedLocale, MessageLoader> = {
  th: () => import('@/messages/th'),
  us: () => import('@/messages/us'),
  gr: () => import('@/messages/gr'),
  it: () => import('@/messages/it'),
  nl: () => import('@/messages/nl'),
  my: () => import('@/messages/my'),
  sg: () => import('@/messages/sg'),
  jp: () => import('@/messages/jp'),
  cn: () => import('@/messages/cn'),
  is: () => import('@/messages/is'),
  vn: () => import('@/messages/vn'),
  id: () => import('@/messages/id'),
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
