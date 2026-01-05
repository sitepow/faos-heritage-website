import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PrivacyClient } from './client'

import { OG_IMAGE } from '@/utils/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'Meta.Privacy',
  })

  const canonicalUrl = `${process.env.APP_URL}/privacy`

  return {
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords'),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonicalUrl,
      siteName: 'FAOS',
      type: 'article',
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: t('ogTitle'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: [OG_IMAGE],
    },
  }
}

export default function Privacy() {
  return (
    <>
      <h1 className='sr-only'>Privacy Policy</h1>
      <PrivacyClient />
    </>
  )
}
