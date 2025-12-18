import type { Metadata } from 'next'
import type { FC } from 'react'

import { PageNotFound } from '@/app/(main)/_components/page-not-found'
import { getProducts } from '@/app/(main)/actions/product'
import { CategoryClient } from '@/app/(main)/category/_components/client/category'
import { siteConfig } from '@/config/site'
import { ITEM_PER_PAGE } from '@/utils/const'
import { getIdFromSlug, getNameFromSlug, OG_IMAGE } from '@/utils/helper'

interface Props {
  params: { slug: string }
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params
  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const categoryName = getNameFromSlug(slugStr)
  const url = `https://faos.asia/category/${slugStr}`

  return {
    title: `${categoryName} | ${siteConfig.name} - ${siteConfig.title}`,
    description: `Browse all ${categoryName} products from ${siteConfig.name}. Premium quality, natural, and carefully selected items.`,
    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${categoryName} | ${siteConfig.name} - ${siteConfig.title}`,
      description: `Browse all ${categoryName} products from ${siteConfig.name}.`,
      url,
      siteName: siteConfig.name,
      type: 'website',
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${categoryName} products from FAOS`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | ${siteConfig.name} - ${siteConfig.title}`,
      description: `Browse all ${categoryName} products from ${siteConfig.name}.`,
      images: [OG_IMAGE],
    },
  }
}

const Categories: FC<Props> = async ({ params }) => {
  const { slug } = await params
  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const categoryId = getIdFromSlug(slugStr)
  const categoryName = getNameFromSlug(slugStr)

  const products = await getProducts({
    limit: ITEM_PER_PAGE,
    categoryId,
  })

  if (!products || products.items.length === 0) {
    return (
      <PageNotFound>
        Sorry! Product category{' '}
        <span className='text-primary'>&quot;{categoryName}&quot;</span>{' '}
        doesn&apos;t match anything at all.
        <br />
        Please try searching for new products on the homepage.
      </PageNotFound>
    )
  }

  return (
    <>
      <h1 className='sr-only'>{categoryName} Products</h1>

      <CategoryClient
        categoryId={categoryId}
        initialProducts={products}
        itemPerPage={ITEM_PER_PAGE}
      />
    </>
  )
}

export default Categories
