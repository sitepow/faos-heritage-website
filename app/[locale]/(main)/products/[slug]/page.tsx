import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductClient } from './product.client'

import { DEFALUT_APP_PATH } from '@/constants'
import { getProduct } from '@/features/product/product.action'
import { constructMetadata } from '@/lib/metadata'
import { getServerUser } from '@/lib/session'
import { parseSlug } from '@/lib/slug'

interface ProductProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({
  params,
}: ProductProps): Promise<Metadata> {
  const { slug, locale } = await params
  const productId = parseSlug(slug)
  const t = await getTranslations({ locale, namespace: 'meta.productDetail' })

  const product = await getProduct(productId, locale)

  if (!product) {
    return constructMetadata({
      title: 'Product Not Found',
      noIndex: true,
    })
  }

  const ogImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url

  return constructMetadata({
    title: t('title', { name: product?.name! }),
    description: product.summary || t('description', { name: product?.name! }),
    ogImage: `${DEFALUT_APP_PATH}/${ogImage}`,
    canonicalPath: `/products/${slug}`,
    keywords: [product.name, product.category?.name || ''],
  })
}

const ProductPage = async ({ params }: ProductProps) => {
  const { slug, locale } = await params
  const { userId } = await getServerUser()
  const productId = parseSlug(slug)

  const product = await getProduct(productId, locale)

  return (
    <ProductClient
      initialData={product}
      productId={productId}
      userId={userId!}
    />
  )
}

export default ProductPage
