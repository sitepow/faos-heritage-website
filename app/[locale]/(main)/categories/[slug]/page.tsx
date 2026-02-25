import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { CategoryClient } from './category.client'

import { getCategoryBySlug } from '@/features/category/category.action'
import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug, locale } = await params

  const t = await getTranslations({ locale, namespace: 'meta' })
  const category = await getCategoryBySlug(slug, locale)

  const keywords = t.raw('category.keywords')

  return constructMetadata({
    title: t('category.title', { categoryName: category?.name || 'Category' }),
    description: t('category.description', {
      categoryName: category?.name || 'Category',
    }),
    canonicalPath: `/categories/${slug}`,
    keywords: keywords,
  })
}

const CategoryPage = async ({ params }: Props) => {
  const { slug } = await params

  return <CategoryClient slug={slug} />
}

export { generateMetadata }
export default CategoryPage
