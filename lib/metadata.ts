/* eslint-disable no-nested-ternary */
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { IMAGE_FALLBACK } from '@/constants'
import { routing } from '@/i18n/routing'

interface Props {
  title?: string
  description?: string
  canonicalPath?: string
  ogImage?: string
  noIndex?: boolean
  keywords?: string | Array<string>
}

const constructMetadata = async ({
  title,
  description,
  canonicalPath = '',
  ogImage = IMAGE_FALLBACK.OG,
  noIndex = false,
  keywords,
}: Props = {}): Promise<Metadata> => {
  const baseUrl = process.env.APP_URL!
  const url = `${baseUrl}${canonicalPath}`

  const t = await getTranslations('meta')
  const brandName = t('brandName')
  const defaultKeywords = t.raw('keywords') || []

  const finalKeywords = Array.isArray(keywords)
    ? [...keywords, ...defaultKeywords]
    : keywords
      ? [keywords, ...defaultKeywords]
      : defaultKeywords

  const languageAlternates = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${baseUrl}/${loc}${canonicalPath}`]),
  )

  return {
    title: {
      default: title || t('home.title'),
      template: `%s | ${brandName}`,
    },
    description,
    keywords: finalKeywords,
    alternates: {
      canonical: url,
      languages: languageAlternates,
    },
    openGraph: {
      title: title ? `${title} | ${brandName}` : t('home.title'),
      description: description ?? undefined,
      url,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${brandName}` : t('home.title'),
      description: description ?? undefined,
      images: [ogImage],
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
    icons: {
      icon: '/favicon.ico',
    },
  }
}

export { constructMetadata }
