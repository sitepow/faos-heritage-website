import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductClient } from './product.client'

import { DEFALUT_APP_PATH } from '@/constants'
import { getProductBySlug } from '@/features/product/product.action'
import { constructMetadata } from '@/lib/metadata'
import { getServerUser } from '@/lib/session'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug, locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.productDetail' })

  const product = await getProductBySlug(slug, locale)

  if (!product) {
    return constructMetadata({
      title: 'Product Not Found',
      noIndex: true,
    })
  }

  const ogImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url

  const pageTitle = product.metaTitle || product.name
  const pageDescription =
    product.metaDescription ||
    product.summary ||
    t('description', { name: product.name })

  const baseKeywords = t.raw('keywords') || []
  const productKeywords = product.keywords || []

  const dynamicKeywords = [product.name, product.category?.name || ''].filter(
    Boolean,
  )

  const allKeywords = [...dynamicKeywords, ...productKeywords, ...baseKeywords]
  const finalKeywords = Array.from(new Set(allKeywords))

  return constructMetadata({
    title: pageTitle,
    description: pageDescription,
    ogImage: ogImage ? `${DEFALUT_APP_PATH}/${ogImage}` : undefined,
    canonicalPath: `/products/${slug}`,
    keywords: finalKeywords,
  })
}

const ProductPage = async ({ params }: Props) => {
  const { slug, locale } = await params
  const { userId } = await getServerUser()

  const product = await getProductBySlug(slug, locale)

  return <ProductClient initialData={product} slug={slug} userId={userId!} />
}

export { generateMetadata }
export default ProductPage
