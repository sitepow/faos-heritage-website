import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

const messages = {
  th: () => import('@/messages/th.json'),
  us: () => import('@/messages/us.json'),
  gr: () => import('@/messages/gr.json'),
  it: () => import('@/messages/it.json'),
  nl: () => import('@/messages/nl.json'),
  my: () => import('@/messages/my.json'),
  sg: () => import('@/messages/sg.json'),
  jp: () => import('@/messages/jp.json'),
  cn: () => import('@/messages/cn.json'),
  is: () => import('@/messages/is.json'),
  vn: () => import('@/messages/vn.json'),
  id: () => import('@/messages/id.json'),
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
