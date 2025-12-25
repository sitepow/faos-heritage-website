import type { Metadata } from 'next'

import { CategoryCarouselClient } from './components/category-carousel/client'
import { ExploreProductsClient } from './components/explore-product.client'
import { getProducts } from './products'
import { getCategories } from '../(dashboard)/dashboard/product'

import {
  AdvertiseBanner,
  CertificateBanner,
} from '@/components/features/banner'
import { siteConfig } from '@/config/site'
import { ITEM_PER_PAGE, OG_IMAGE } from '@/utils/constants'

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.title}`,
  description:
    'FAOS offers premium organic olive oil and honey made from 100% natural ingredients. Shop authentic, healthy, and high-quality products.',
  keywords: [
    'FAOS',
    'organic olive oil',
    'organic honey',
    'premium olive oil',
    'natural food',
  ],
  alternates: {
    canonical: 'https://faos.asia',
  },

  openGraph: {
    title: siteConfig.title,
    description: `${siteConfig.name} - ${siteConfig.title}`,
    url: 'https://faos.asia',
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${siteConfig.title}`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: `${siteConfig.title}`,
    images: [OG_IMAGE],
  },
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
      <CategoryCarouselClient
        initialCategories={categories}
        initialProducts={products}
        itemPerPage={ITEM_PER_PAGE}
      />
      <CertificateBanner />
      <ExploreProductsClient
        initialProducts={exploreProducts}
        itemPerPage={ITEM_PER_PAGE}
      />
      <AdvertiseBanner />
    </section>
  )
}
