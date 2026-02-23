import { notFound } from 'next/navigation'

import type { Metadata } from 'next'

import { PostsByCategoryClient } from './posts.client'

import { getBlogCategoryBySlug } from '@/features/blog-category/blog-category.action'
import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const category = await getBlogCategoryBySlug(slug)

  if (!category) {
    return {}
  }

  return constructMetadata({
    title: category.name,
  })
}

const CategoryPostsPage = async ({ params }: Props) => {
  const { slug } = await params
  const category = await getBlogCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  return <PostsByCategoryClient category={category} />
}

export default CategoryPostsPage
export { generateMetadata }
