/* eslint-disable no-nested-ternary */
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { IMAGE_FALLBACK } from '@/constants'

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
  const url = `${process.env.APP_URL}${canonicalPath}`

  const t = await getTranslations('metadata')
  const defaultKeywords = t.raw('commonKeywords') || []

  const finalKeywords = Array.isArray(keywords)
    ? [...keywords, ...defaultKeywords]
    : keywords
      ? [keywords, ...defaultKeywords]
      : defaultKeywords

  return {
    title,
    description,
    keywords: finalKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      url,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? undefined,
      description: description ?? undefined,
      images: [ogImage],
    },
    ...(noIndex && {
      robots: { index: false, follow: false },
    }),
  }
}

export { constructMetadata }
