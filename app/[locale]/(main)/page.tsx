import { getLocale, getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { CategoryClient } from './_components/category.client'
import { ExploreProductsClient } from './_components/explore-product.client'
import { getProducts } from './products/action'

import { AdvertiseBanner } from '@/components/Banner/advertise'
import { ITEM_PER_PAGE } from '@/constants/app'
import { OG_IMAGE } from '@/constants/seo'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({
    locale,
    namespace: 'Meta.Home',
  })

  return {
    description: t('description'),
    keywords: t.raw('keywords'),
    alternates: {
      canonical: process.env.APP_URL,
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: process.env.APP_URL,
      siteName: 'FAOS',
      type: 'website',
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      description: t('ogDescription'),
      images: OG_IMAGE,
    },
  }
}

export default async function Homepage() {
  const locale = await getLocale()
  const exploreProducts = await getProducts({ limit: ITEM_PER_PAGE, locale })

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='flex w-full flex-col gap-5 p-5'>
        <CategoryClient />
        <ExploreProductsClient
          initialProducts={exploreProducts}
          itemPerPage={ITEM_PER_PAGE}
        />
        <AdvertiseBanner />
      </div>
    </section>
  )
}
