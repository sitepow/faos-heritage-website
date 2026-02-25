import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { ProductsClient } from './products.client'

import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'meta' })

  const keywords = t.raw('products.keywords')

  return constructMetadata({
    title: t('products.title'),
    description: t('products.description'),
    canonicalPath: '/products',
    keywords: keywords,
  })
}

const ProductsPage = async () => {
  return <ProductsClient />
}

export { generateMetadata }
export default ProductsPage
