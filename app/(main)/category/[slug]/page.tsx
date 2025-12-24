import type { Metadata } from 'next'

import { CategoryClient } from '@/app/(main)/category/[slug]/client'
import { getProducts } from '@/app/(main)/products/action'
import { PageNotFound } from '@/components/common/page-not-found'
import { siteConfig } from '@/config/site'
import { ITEM_PER_PAGE, OG_IMAGE } from '@/utils/constants'
import { getIdFromSlug, getNameFromSlug } from '@/utils/slug'

interface CategoryProps {
  params: { slug: string }
}

export const generateMetadata = async ({
  params,
}: CategoryProps): Promise<Metadata> => {
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

export default async function Category({ params }: CategoryProps) {
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
        Sorry! Product category Nothing matches. Please try searching for new
        products on the homepage.
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
