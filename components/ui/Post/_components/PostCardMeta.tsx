'use client'

import { CalendarIcon, EyeIcon } from 'lucide-react'
import { memo } from 'react'

import { PostAuthorAvatar } from '../PostAuthorAvatar'

import { formatDate } from '@/utils'

interface Props {
  publishedAt: Date | string
  viewCount?: number
  author?: { name: string | null; image: string | null }
}

const PostCardMeta = memo(({ publishedAt, viewCount = 0, author }: Props) => {
  return (
    <div className='flex flex-wrap items-center gap-3 border-t border-white/10 pt-4 text-white/90'>
      <div className='flex items-center gap-2'>
        <PostAuthorAvatar
          author={author}
          className='size-6 border-1 border-white/20'
          iconSize={12}
        />
        <span className='cursor-pointer text-sm font-medium transition-all hover:underline'>
          {author?.name!}
        </span>
      </div>

      <span className='text-white/50'>·</span>

      <div className='flex flex-wrap items-center gap-3 text-[13px] text-white/70'>
        <CalendarIcon size={22} />
        <span>{formatDate(publishedAt)}</span>

        {viewCount !== 0 && (
          <>
            <span className='text-white/50'>·</span>
            <div className='flex items-center gap-1'>
              <EyeIcon size={22} />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
})

export { PostCardMeta }
