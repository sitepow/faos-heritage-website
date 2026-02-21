'use client'

import { Chip } from '@heroui/react'

import { PostCardImage } from '@/components/ui/Post/_components/PostCardImage'
import { PostCardMeta } from '@/components/ui/Post/_components/PostCardMeta'
import { IMAGE_FALLBACK } from '@/constants'

interface Props {
  title: string
  featuredImage?: string | null
  category?: { name: string } | null
  publishedAt?: Date | null
  viewCount?: number
  author?: { name: string | null; image: string | null } | null
}

const PostHeader = ({
  title,
  featuredImage,
  category,
  publishedAt,
  viewCount = 0,
  author,
}: Props) => {
  return (
    <header className='border-default-100 relative h-[400px] w-full overflow-hidden rounded-lg border md:h-[550px]'>
      <PostCardImage alt={title} src={featuredImage || IMAGE_FALLBACK.EMPTY} />

      <div className='absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10'>
        {category?.name && (
          <div className='mb-3'>
            <Chip
              className='bg-primary text-tiny h-6 border-none font-bold text-white uppercase'
              size='sm'
              variant='flat'
            >
              {category.name}
            </Chip>
          </div>
        )}

        <h1 className='mb-4 text-3xl leading-tight font-bold text-white md:text-5xl lg:max-w-4xl'>
          {title}
        </h1>

        <PostCardMeta
          author={author!}
          publishedAt={publishedAt!}
          viewCount={viewCount}
        />
      </div>
    </header>
  )
}

export { PostHeader }
