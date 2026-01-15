import { getLocale, getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { CategoryCarouselClient } from './_components/category-carousel/client'
import { ExploreProductsClient } from './_components/explore-product.client'
import { getProducts } from './products/action'
import { getCategories } from '../(dashboard)/dashboard/product/action/category'

import { AdvertiseBanner } from '@/components/banner/advertise'
import { CarouselImageBanner } from '@/components/banner/carousel-image'
import { CertificateBanner } from '@/components/banner/certificate'
import { CustomerBanner } from '@/components/banner/customer'
import { MarketplaceBanner } from '@/components/banner/marketplace'
import { Country } from '@/components/navbar/country'
import { ITEM_PER_PAGE } from '@/utils/constants/app'
import { OG_IMAGE } from '@/utils/constants/seo'

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
  const categories = await getCategories()
  const exploreProducts = await getProducts({ limit: ITEM_PER_PAGE, locale })

  const categoryId = categories?.[0]?.id
  const products = categoryId
    ? await getProducts({ limit: ITEM_PER_PAGE, categoryId, locale })
    : { items: [], nextCursor: null, totalCount: 0 }

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='container mx-auto flex w-fit'>
        <Country />
      </div>
      <CarouselImageBanner />
      <CategoryCarouselClient
        initialCategories={categories}
        initialProducts={products}
        itemPerPage={ITEM_PER_PAGE}
      />
      <ExploreProductsClient
        initialProducts={exploreProducts}
        itemPerPage={ITEM_PER_PAGE}
      />
      <div className='flex w-full flex-col'>
        <AdvertiseBanner />
        <CertificateBanner />
        <MarketplaceBanner />
        <CustomerBanner />
      </div>
    </section>
  )
}
