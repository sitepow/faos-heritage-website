import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductsClient } from './products.client'

import { constructMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'meta' })

  return constructMetadata({
    title: t('products.title'),
    description: t('products.description'),
  })
}

const ProductsPage = async () => {
  return <ProductsClient />
}

export default ProductsPage
