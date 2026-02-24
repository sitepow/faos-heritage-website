'use client'

import { PostStatus } from '@prisma/client'
import { useLocale, useTranslations } from 'next-intl'

import { AppSection } from '@/components/layouts/AppSection'
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
    <AppSection>
      <h3 className='text-2xl font-bold'>{t('related_title')}</h3>

      <PostSection
        isLoading={isLoading}
        itemPerPage={6}
        items={relatedData?.items ?? []}
      />
    </AppSection>
  )
}

export { RelatedPosts }
