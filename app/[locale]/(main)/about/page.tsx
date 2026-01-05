import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PdfViewer } from '@/components/pdf-viewer'
import { OG_IMAGE } from '@/utils/constants'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'Meta.About',
  })

  const canonicalUrl = `${process.env.APP_URL}/about`

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

export default function About() {
  const t = useTranslations('About')

  return (
    <>
      <section className='flex justify-center'>
        <PdfViewer fileUrl='/documents/faos-organic-olive-oil-brochure.pdf' />
      </section>

      <section className='sr-only'>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
        <ul>
          <li>{t('philosophy')}</li>
          <li>{t('quality')}</li>
          <li>{t('origin')}</li>
        </ul>
      </section>
    </>
  )
}
