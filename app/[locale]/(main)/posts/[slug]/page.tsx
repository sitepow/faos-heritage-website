import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PostClient } from './post.client'

import { IMAGE_FALLBACK } from '@/constants'
import { getPostBySlug } from '@/features/post/action'
import { constructMetadata, getSafeOgImage } from '@/lib/metadata'

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug, locale } = await params

  const t = await getTranslations({ locale, namespace: 'meta.blogDetail' })
  const post = await getPostBySlug(slug, locale)

  if (!post) {
    return constructMetadata({
      title: 'Post Not Found',
      noIndex: true,
    })
  }

  const pageTitle = post.metaTitle || post.title
  const pageDescription =
    post.metaDescription ||
    post.summary ||
    t('description', { summary: post.summary || post.title })

  const baseKeywords = t.raw('keywords') || []
  const postKeywords = post.keywords || []

  const dynamicKeywords = [post.title, post.category?.name || ''].filter(
    Boolean,
  )

  const finalKeywords = Array.from(
    new Set([...dynamicKeywords, ...postKeywords, ...baseKeywords]),
  )

  const ogImage = post.featuredImage || IMAGE_FALLBACK.OG
  const finalOgImage = getSafeOgImage(ogImage, post.updatedAt)

  return constructMetadata({
    title: pageTitle,
    description: pageDescription,
    ogImage: finalOgImage,
    canonicalPath: `/posts/${slug}`,
    keywords: finalKeywords,
    locale: locale,
  })
}

const PostPage = async ({ params }: Props) => {
  const { slug, locale } = await params

  const post = await getPostBySlug(slug, locale)

  return <PostClient initialData={post} slug={slug} />
}

export { generateMetadata }
export default PostPage
