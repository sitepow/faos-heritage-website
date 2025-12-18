import type { Metadata } from 'next'

import { getCategories } from '../(dashboard)/actions/category'
import { CategoryClient } from './_components/client/category'

import { ExploreProducts } from '@/app/(main)/_components/client/explore-products'
import { getProducts } from '@/app/(main)/actions/product'
import { BannerCertificate } from '@/components/banner/certificate'
import { siteConfig } from '@/config/site'
import { ITEM_PER_PAGE } from '@/utils/const'
import { OG_IMAGE } from '@/utils/helper'

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

const Index = async () => {
  const categories = await getCategories()
  const exploreProducts = await getProducts({ limit: ITEM_PER_PAGE })

  const categoryId = categories?.[0]?.id
  const products = categoryId
    ? await getProducts({ limit: ITEM_PER_PAGE, categoryId })
    : { items: [], nextCursor: null, totalCount: 0 }

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <CategoryClient
        initialCategories={categories}
        initialProducts={products}
        itemPerPage={ITEM_PER_PAGE}
      />

      <BannerCertificate />

      {products?.items?.length !== 0 && (
        <ExploreProducts
          initialProducts={exploreProducts}
          itemPerPage={ITEM_PER_PAGE}
        />
      )}
    </section>
  )
}

export default Index
