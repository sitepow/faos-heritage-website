import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'

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

  return {
    icons: {
      icon: '/favicon.ico',
    },
  }
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
