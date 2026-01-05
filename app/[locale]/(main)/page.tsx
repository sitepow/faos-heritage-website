import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { CategoryCarouselClient } from './_components/category-carousel/client'
import { ExploreProductsClient } from './_components/explore-product.client'
import { getProducts } from './products'
import { getCategories } from '../(dashboard)/dashboard/product'

import {
  AdvertiseBanner,
  CertificateBanner,
} from '@/components/features/banner'
import { CarouselImageBanner } from '@/components/features/banner/carousel-image'
import { CustomerBanner } from '@/components/features/banner/customer'
import { ITEM_PER_PAGE, OG_IMAGE } from '@/utils/constants'

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
    title: t('title'),
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
          alt: t('ogTitle'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('ogTitle'),
      description: t('ogDescription'),
      images: OG_IMAGE,
    },
  }
}

export default async function Homepage() {
  const categories = await getCategories()
  const exploreProducts = await getProducts({ limit: ITEM_PER_PAGE })

  const categoryId = categories?.[0]?.id
  const products = categoryId
    ? await getProducts({ limit: ITEM_PER_PAGE, categoryId })
    : { items: [], nextCursor: null, totalCount: 0 }

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CarouselImageBanner />
      <CategoryCarouselClient
        initialCategories={categories}
        initialProducts={products}
        itemPerPage={ITEM_PER_PAGE}
      />
      <CustomerBanner />
      <CertificateBanner />
      <ExploreProductsClient
        initialProducts={exploreProducts}
        itemPerPage={ITEM_PER_PAGE}
      />
      <AdvertiseBanner />
    </section>
  )
}
