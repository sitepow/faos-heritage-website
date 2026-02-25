'use client'

import { PostStatus } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'

import type { GetPostsInfiniteResult } from '@/features/post/post.action'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { PostSection } from '@/components/ui/Post/PostSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { THRESHOLD_SCROLL_FETCH } from '@/constants'
import { usePostsInfinite } from '@/features/post/post.hook'
import { useWindowInfiniteScroll } from '@/hooks/useWindowInfiniteScroll'

interface PostsByCategoryClientProps {
  category: {
    id: string
    name: string
  }
  initialData: GetPostsInfiniteResult
}

const PostsByCategoryClient = ({
  category,
  initialData,
}: PostsByCategoryClientProps) => {
  const locale = useLocale()
  const t = useTranslations('shared')
  const tStatus = useTranslations('status')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePostsInfinite({
      status: PostStatus.PUBLISHED,
      categoryId: category.id,
      limit: 12,
      locale,
      initialData,
    })

  useWindowInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: THRESHOLD_SCROLL_FETCH,
  })

  const posts = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <Container>
      <AppSection>
        <SectionHeader
          as='h1'
          description={`${t('blogDiscovery.description')} (${category.name})`}
          title={category.name}
        />

        <PostSection items={posts} />

        {!isLoading && posts.length === 0 && (
          <EmptyState description={tStatus('noData')} />
        )}
      </AppSection>
    </Container>
  )
}

export { PostsByCategoryClient }
