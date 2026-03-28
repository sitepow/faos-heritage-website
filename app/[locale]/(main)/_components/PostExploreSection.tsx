'use client'

import { Button } from '@heroui/react'
import { PostStatus } from '@prisma/client'
import Link from 'next/link'
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
  const tActions = useTranslations('actions')

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
      <Container className='flex flex-col gap-10'>
        <SectionHeader
          description={tShared('blogDiscovery.description')}
          title={tShared('blogDiscovery.title')}
        />

        <Link className='mx-auto' href='/posts'>
          <Button variant='faded'>{tActions('more')}</Button>
        </Link>

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
