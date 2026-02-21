import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PostClient } from './post.client'

import { IMAGE_FALLBACK } from '@/constants'
import { getPost } from '@/features/post/post.action'
import { constructMetadata } from '@/lib/metadata'
import { parseSlug } from '@/lib/slug'

interface PostProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const { slug, locale } = await params
  const postId = parseSlug(slug)

  const t = await getTranslations({ locale, namespace: 'meta.blogDetail' })

  const post = await getPost(postId)

  if (!post) {
    return constructMetadata({
      title: 'Post Not Found',
      noIndex: true,
    })
  }

  const ogImage = post.featuredImage || IMAGE_FALLBACK.OG

  return constructMetadata({
    title: t('title', { title: post.title }),
    description: post.summary || t('description', { summary: post?.summary! }),
    ogImage,
    canonicalPath: `/posts/${slug}`,
    keywords: [post.title, post?.category?.name!],
  })
}

const PostPage = async ({ params }: PostProps) => {
  const { slug } = await params
  const postId = parseSlug(slug)

  const post = await getPost(postId)

  return <PostClient initialData={post} postId={postId} />
}

export default PostPage
