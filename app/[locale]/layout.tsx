import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import {
  setRequestLocale,
  getMessages,
  getTranslations,
} from 'next-intl/server'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { routing } from '@/i18n/routing'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const t = await getTranslations({
    locale,
    namespace: 'Site',
  })

  const name = t('name')
  const title = t('title')
  const description = t('description')

  return {
    title: {
      default: `${name} - ${title}`,
      template: `%s | ${name} - ${title}`,
    },
    description,
    icons: {
      icon: '/favicon.ico',
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
