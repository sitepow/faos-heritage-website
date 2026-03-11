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
  alternates?: Metadata['alternates']
  locale?: string
}

const constructMetadata = async ({
  title,
  description,
  canonicalPath = '',
  ogImage = IMAGE_FALLBACK.OG,
  noIndex = false,
  keywords,
  alternates,
  locale = 'en',
}: Props = {}): Promise<Metadata> => {
  const baseUrl = process.env.APP_URL!

  const currentUrl = `${baseUrl}/${locale}${canonicalPath}`

  const t = await getTranslations({ locale, namespace: 'meta' })
  const brandName = t('brandName')
  const defaultKeywords = t.raw('keywords') || []

  const finalKeywords = Array.isArray(keywords)
    ? [...keywords, ...defaultKeywords]
    : keywords
      ? [keywords, ...defaultKeywords]
      : defaultKeywords

  const defaultLanguageAlternates = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${baseUrl}/${loc}${canonicalPath}`]),
  )

  const ogImageWithCacheBuster = ogImage
    ? `${ogImage}?v=${Date.now()}`
    : ogImage

  return {
    title: {
      default: title || t('home.title'),
      template: `%s | ${brandName}`,
    },
    description,
    keywords: finalKeywords,
    alternates: alternates || {
      canonical: currentUrl,
      languages: {
        ...defaultLanguageAlternates,
        'x-default': `${baseUrl}/en${canonicalPath}`,
      },
    },
    openGraph: {
      title: title ? `${title} | ${brandName}` : t('home.title'),
      description: description ?? undefined,
      url: currentUrl,
      type: 'website',
      images: [{ url: ogImageWithCacheBuster, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${brandName}` : t('home.title'),
      description: description ?? undefined,
      images: [ogImageWithCacheBuster],
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
