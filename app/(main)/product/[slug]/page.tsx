import { getSession } from 'next-auth/react'

import type { Metadata } from 'next'

import { getProduct } from '@/app/(dashboard)/dashboard/product/action/product'
import { ProductClient } from '@/app/(main)/product/[slug]/client'
import { PageNotFound } from '@/components/common/page-not-found'
import { siteConfig } from '@/config/site'
import { OG_IMAGE } from '@/utils/constants'
import { getIdFromSlug } from '@/utils/slug'

interface ProductProps {
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const { slug } = await params

  const slugStr = Array.isArray(slug) ? slug[0] : slug

  const productId = getIdFromSlug(slugStr)

  try {
    const product = await getProduct(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    const productUrl = `https://faos.asia/product/${slugStr}`
    const imageUrl = product.images?.[0]?.url ?? OG_IMAGE

    return {
      title: `${product.name} | ${siteConfig.name} - ${siteConfig.title}`,
      description:
        product.shortDescription ||
        `Buy ${product.name} from FAOS. Premium organic olive oil & honey.`,
      alternates: {
        canonical: productUrl,
      },

      openGraph: {
        title: product.name,
        description:
          product.shortDescription || `Premium organic product from FAOS.`,
        url: productUrl,
        siteName: siteConfig.name,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },

      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description:
          product.shortDescription || `Premium organic product from FAOS.`,
        images: [imageUrl],
      },
    }
  } catch {
    return {
      title: `Product Not Found | ${siteConfig.name}`,
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

export default async function Product({ params }: ProductProps) {
  const { slug } = await params

  const session = await getSession()
  const userId = session?.user?.id

  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const productId = getIdFromSlug(slugStr)

  const product = await getProduct(productId, userId)

  if (!product) {
    return (
      <PageNotFound>
        Sorry! Product Nothing matches. Please try searching for new products on
        the homepage.
      </PageNotFound>
    )
  }

  return (
    <ProductClient
      initialProduct={product}
      productId={productId}
      userId={userId!}
    />
  )
}
