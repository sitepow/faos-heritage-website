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

const assertValidLocale = (locale: string) => {
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
}

const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  assertValidLocale(locale)

  const t = await getTranslations({ locale, namespace: 'meta' })
  const baseUrl = process.env.APP_URL!

  const languages: Record<string, string> = {}
  routing.locales.forEach((loc) => {
    languages[loc] = `${baseUrl}/${loc}`
  })

  return constructMetadata({
    title: t('home.title'),
    description: t('home.description'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        ...languages,
        'x-default': `${baseUrl}/th`,
      },
    },
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

export { generateMetadata }
export default LocaleLayout
