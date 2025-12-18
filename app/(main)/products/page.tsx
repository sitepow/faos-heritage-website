import type { Metadata } from 'next'

import { PageNotFound } from '@/app/(main)/_components/page-not-found'
import { getProducts } from '@/app/(main)/actions/product'
import { ProductsClient } from '@/app/(main)/products/_components/client/products'
import { siteConfig } from '@/config/site'
import { ITEM_PER_PAGE } from '@/utils/const'
import { OG_IMAGE } from '@/utils/helper'

export const metadata: Metadata = {
  title: `All Products | ${siteConfig.name} - ${siteConfig.title}`,
  description:
    'Browse all FAOS premium organic olive oil and honey products. Discover healthy, natural, and high-quality selections.',
  keywords: [
    'FAOS products',
    'organic olive oil',
    'organic honey',
    'premium food',
    'natural products',
  ],
  alternates: {
    canonical: 'https://faos.asia/products',
  },

  openGraph: {
    title: `All Products | ${siteConfig.name} - ${siteConfig.title}`,
    description:
      'Browse all FAOS premium organic olive oil and honey products.',
    url: 'https://faos.asia/products',
    siteName: siteConfig.name,
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'FAOS premium organic olive oil and honey products',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `All Products | ${siteConfig.name} - ${siteConfig.title}`,
    description:
      'Browse all FAOS premium organic olive oil and honey products.',
    images: [OG_IMAGE],
  },
}

const ProductsPage = async () => {
  const products = await getProducts({ limit: ITEM_PER_PAGE })

  if (!products || products.items.length === 0) {
    return (
      <PageNotFound>
        We apologize, the product was not found in our system. Please try
        searching for the product again on the homepage.
      </PageNotFound>
    )
  }

  return (
    <>
      <h1 className='sr-only'>All FAOS Products</h1>

      <ProductsClient initialProducts={products} itemPerPage={ITEM_PER_PAGE} />
    </>
  )
}

export default ProductsPage
