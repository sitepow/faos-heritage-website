import type { Metadata } from 'next'
import type { FC } from 'react'

import { getProduct } from '@/app/(dashboard)/actions/product'
import { PageNotFound } from '@/app/(main)/_components/page-not-found'
import { ProductClient } from '@/app/(main)/product/[slug]/_components/client/product'
import { siteConfig } from '@/config/site'
import { getSession } from '@/lib/auth/require-session'
import { getIdFromSlug, OG_IMAGE } from '@/utils/helper'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

const Product: FC<Props> = async ({ params }) => {
  const { slug } = await params

  const session = await getSession()
  const userId = session?.user?.id

  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const productId = getIdFromSlug(slugStr)

  const product = await getProduct(productId, userId)

  if (!product) {
    return (
      <PageNotFound>
        Sorry! Product ID...{' '}
        <span className='text-primary'>&quot;{productId}&quot;</span> Nothing
        matches. Please try searching for new products on the homepage.
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

export default Product
