import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

type SupportedLocale = (typeof routing.locales)[number]

type MessageLoader = () => Promise<{ default: Record<string, unknown> }>

const MESSAGE_LOADERS: Record<SupportedLocale, MessageLoader> = {
  th: () => import('@/messages/th'),
  // us: () => import('@/messages/us.json'),
  // gr: () => import('@/messages/gr.json'),
  // it: () => import('@/messages/it.json'),
  // nl: () => import('@/messages/nl.json'),
  // my: () => import('@/messages/my.json'),
  // sg: () => import('@/messages/sg.json'),
  // jp: () => import('@/messages/jp.json'),
  // cn: () => import('@/messages/cn.json'),
  // is: () => import('@/messages/is.json'),
  // vn: () => import('@/messages/vn.json'),
  // id: () => import('@/messages/id.json'),
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
