import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductClient } from './product.client'

import { COUNTRY_CONFIG } from '@/constants'
import { getProductBySlug } from '@/features/product/product.action'
import { constructMetadata, getSafeOgImage } from '@/lib/metadata'
import { getServerUser } from '@/lib/session'
import { formatCurrencyRange, getExchangeRates } from '@/utils'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug, locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.productDetail' })

  const [product, rates] = await Promise.all([
    getProductBySlug(slug, locale),
    getExchangeRates().catch(() => null),
  ])

  if (!product) {
    return constructMetadata({ title: 'Product Not Found', noIndex: true })
  }

  const countryKey = locale.toUpperCase() as keyof typeof COUNTRY_CONFIG
  const config = COUNTRY_CONFIG[countryKey]

  const minPrice = product.priceMin ?? (product.price || 0)
  const maxPrice = product.priceMax ?? (product.price || 0)

  const priceString = formatCurrencyRange(minPrice, maxPrice, {
    currency: config?.currency || 'USD',
    locale: config?.locale || 'en-US',
    rates: rates,
  })

  const ogImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url
  const finalOgImage = getSafeOgImage(ogImage, product.updatedAt)
  const pageTitle = product.metaTitle || product.name

  const baseDescription =
    product.metaDescription ||
    product.summary ||
    t('description', { name: product.name })
  const pageDescription = `${priceString} | ${baseDescription}`

  const baseKeywords = t.raw('keywords') || []
  const productKeywords = product.keywords || []
  const dynamicKeywords = [product.name, product.category?.name || ''].filter(
    Boolean,
  )
  const finalKeywords = Array.from(
    new Set([...dynamicKeywords, ...productKeywords, ...baseKeywords]),
  )

  return constructMetadata({
    title: pageTitle,
    description: pageDescription,
    ogImage: finalOgImage,
    canonicalPath: `/products/${slug}`,
    keywords: finalKeywords,
    locale: locale,
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
