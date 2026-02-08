import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { CategoryClient } from './category.client'

import { getCategory } from '@/features/category/category.action'
import { constructMetadata } from '@/lib/metadata'
import { parseSlug } from '@/lib/slug'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const categoryId = parseSlug(slug)

  const t = await getTranslations({ locale, namespace: 'meta' })
  const category = await getCategory(categoryId!)

  return constructMetadata({
    title: t('category.title', { categoryName: category?.name! }),
    description: t('category.description', { categoryName: category?.name! }),
  })
}

const CategoryPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params
  const categoryId = parseSlug(slug)

  return <CategoryClient categoryId={categoryId} />
}

export default CategoryPage
