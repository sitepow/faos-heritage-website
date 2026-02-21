import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { PostsClient } from './posts.client'

import { constructMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'meta' })

  return constructMetadata({
    title: t('blog.title'),
    description: t('blog.description'),
  })
}

const PostsPage = async () => {
  return <PostsClient />
}

export default PostsPage
