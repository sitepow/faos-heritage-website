import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { routing } from '@/i18n/routing'

interface LocaleLayoutProps {
  children: ReactNode
  params: {
    locale: string
  }
}

function assertValidLocale(locale: string) {
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params

  assertValidLocale(locale)

  const translate = await getTranslations({
    locale,
    namespace: 'Site',
  })

  const siteName = translate('name')
  const title = translate('title')

  return {
    title: {
      default: `${siteName} - ${title}`,
      template: `%s | ${siteName} - ${title}`,
    },
    description: translate('description'),
    icons: {
      icon: '/favicon.ico',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  assertValidLocale(locale)
  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
