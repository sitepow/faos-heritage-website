import { getSession } from 'next-auth/react'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductClient } from './product.client'

import { EmptyState } from '@/components/ui/EmptyState'
import { IMAGE_FALLBACK } from '@/constants/app'
import { getProduct } from '@/features/product/product.action'
import { extractIdFromSlug } from '@/utils/app'

interface ProductProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const { slug, locale } = await params
  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const productId = extractIdFromSlug(slugStr)

  const t = await getTranslations({
    locale,
    namespace: 'Meta.ProductDetail',
  })

  try {
    const product = await getProduct(productId, undefined, locale)

    if (!product) throw new Error('Product not found')

    const productUrl = `${process.env.APP_URL}/product/${slugStr}`
    const primaryImage =
      product.images?.find((img) => img.isPrimary) ?? product.images?.[0]
    const imageUrl = primaryImage?.url ?? IMAGE_FALLBACK.OG

    const title = t('title', { name: product.name })
    const description =
      product.shortDescription ||
      t('defaultDescription', { name: product.name })

    return {
      title,
      description,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title,
        description,
        url: productUrl,
        siteName: 'FAOS',
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
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch {
    return {
      title: t('notFound'),
      robots: { index: false, follow: false },
    }
  }
}

export default async function Product({ params }: ProductProps) {
  const { slug } = await params
  const session = await getSession()
  const userId = session?.user?.id

  const slugStr = Array.isArray(slug) ? slug[0] : slug
  const productId = extractIdFromSlug(slugStr)

  const product = await getProduct(productId, userId)

  if (!product) {
    return (
      <EmptyState>
        Sorry! Product Nothing matches. Please try searching for new products on
        the homepage.
      </EmptyState>
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
