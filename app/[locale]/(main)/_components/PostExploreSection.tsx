'use client'

import { Button } from '@heroui/react'
import { PostStatus } from '@prisma/client'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import type { GetPostsInfiniteResult } from '@/features/post/post.action'

import { AppSection } from '@/components/layouts/AppSection'
import { Container } from '@/components/layouts/Container'
import { PostSection } from '@/components/ui/Post/PostSection'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { usePosts } from '@/features/post/post.hook'

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
    <Container>
      <AppSection>
        <SectionHeader
          description={tShared('blogDiscovery.description')}
          title={tShared('blogDiscovery.title')}
        />

        <PostSection
          isLoading={isPostsLoading}
          itemPerPage={itemsPerPage}
          items={posts}
        />

        <Link className='mx-auto' href='/posts'>
          <Button
            className='text-secondary'
            color='primary'
            endContent={<ArrowRightIcon />}
            radius='sm'
          >
            {tActions('more')}
          </Button>
        </Link>
      </AppSection>
    </Container>
  )
}

export { PostExploreSection }
