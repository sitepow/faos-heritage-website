'use client'

import { PostStatus } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'

import { PostSection } from '@/components/ui/Post/PostSection'
import { usePosts } from '@/features/post/post.hook'

interface Props {
  categoryId?: string | null
  excludeId: string
}

const RelatedPosts = ({ categoryId, excludeId }: Props) => {
  const t = useTranslations('global.post')
  const locale = useLocale()

  const { data: relatedData, isLoading } = usePosts({
    categoryId,
    excludeId,
    limit: 6,
    locale,
    status: PostStatus.PUBLISHED,
  })

  if (!isLoading && (!relatedData?.items || relatedData.items.length === 0)) {
    return null
  }

  return (
    <section
      aria-labelledby='related-posts-title'
      className='flex flex-col gap-6 py-10'
    >
      <h2 className='text-2xl font-bold' id='related-posts-title'>
        {t('related_title')}
      </h2>

      <PostSection
        isLoading={isLoading}
        itemPerPage={6}
        items={relatedData?.items ?? []}
      />
    </section>
  )
}

export { RelatedPosts }
