import { PostStatus } from '@prisma/client'
import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PostsClient } from './posts.client'

import { getPostsInfinite } from '@/features/post/post.action'
import { constructMetadata } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return constructMetadata({
    title: t('blog.title'),
    description: t('blog.description'),
  })
}

const PostsPage = async ({ params }: Props) => {
  const { locale } = await params

  const initialData = await getPostsInfinite({
    status: PostStatus.PUBLISHED,
    limit: 12,
    locale,
  })

  return <PostsClient initialData={initialData} />
}

export default PostsPage
