import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PaymentClient } from './client'

import { OG_IMAGE } from '@/constants/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'Meta.Payment',
  })

  const canonicalUrl = `${process.env.APP_URL}/payment`

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

export default function Payment() {
  return (
    <>
      <h1 className='sr-only'>Payment Methods at FAOS</h1>
      <PaymentClient />
    </>
  )
}
