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
import { constructMetadata } from '@/lib/metadata'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{
    locale: string
  }>
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

  const t = await getTranslations({ locale, namespace: 'meta' })

  return constructMetadata({
    title: t('home.title'),
    description: t('home.description'),
  })
}

const LocaleLayout = async ({ children, params }: LocaleLayoutProps) => {
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

export default LocaleLayout
