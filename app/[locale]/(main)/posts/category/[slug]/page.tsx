import { PostStatus } from '@prisma/client'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PostsByCategoryClient } from './posts.client'

import { getBlogCategoryBySlug } from '@/features/blog-category/blog-category.action'
import { getPostsInfinite } from '@/features/post/post.action'
import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug, locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const category = await getBlogCategoryBySlug(slug, locale)

  if (!category) {
    return {}
  }

  return constructMetadata({
    title: t('category.title', { categoryName: category?.name! }),
    description: t('category.description', { categoryName: category?.name! }),
  })
}

const CategoryPostsPage = async ({ params }: Props) => {
  const { slug, locale } = await params
  const category = await getBlogCategoryBySlug(slug, locale)

  if (!category) {
    notFound()
  }

  const initialData = await getPostsInfinite({
    categoryId: category.id,
    status: PostStatus.PUBLISHED,
    limit: 12,
    locale,
  })

  return <PostsByCategoryClient category={category} initialData={initialData} />
}

export default CategoryPostsPage
