'use client'

import { PostStatus } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'

import type { GetPostsInfiniteResult } from '@/features/post/action'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { PostSection } from '@/components/ui/Post/PostSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { usePosts } from '@/features/post/hook'

interface Props {
  initialData?: GetPostsInfiniteResult
  itemsPerPage: number
}

const PostExploreSection = ({ initialData, itemsPerPage }: Props) => {
  const locale = useLocale()
  const tShared = useTranslations('shared')

  const { data: postsData, isLoading: isPostsLoading } = usePosts({
    locale,
    status: PostStatus.PUBLISHED,
    limit: itemsPerPage,
    initialData,
  })

  const posts = postsData?.items ?? []

  if (posts.length === 0) {
    return null
  }

  return (
    <AppSection>
      <Container className='flex flex-col gap-5'>
        <SectionHeader
          description={tShared('blogDiscovery.description')}
          link='/posts'
          title={tShared('blogDiscovery.title')}
        />

        <PostSection
          isLoading={isPostsLoading}
          itemPerPage={itemsPerPage}
          items={posts}
        />
      </Container>
    </AppSection>
  )
}

export { PostExploreSection }
