'use client'

import { CalendarIcon } from 'lucide-react'
import { memo } from 'react'

import { Dot } from './Dot'
import { CommentCount } from '../../CommentCount'
import { ViewCount } from '../../ViewCount'
import { PostAuthorAvatar } from '../PostAuthorAvatar'

import { formatDate } from '@/utils'

interface Props {
  publishedAt: Date | string
  viewCount?: number
  commentCount?: number
  author?: { name: string | null; image: string | null }
}

const PostCardMeta = memo(
  ({ publishedAt, viewCount = 0, commentCount = 0, author }: Props) => {
    return (
      <footer className='text-foreground/90 border-foreground/20 flex flex-wrap items-center gap-3 border-t pt-4'>
        <div className='flex items-center gap-2'>
          <PostAuthorAvatar author={author} iconSize={12} />
          <span className='cursor-pointer text-sm font-medium transition-all hover:underline'>
            {author?.name!}
          </span>
        </div>

        <Dot />

        <div className='text-foreground/70 flex flex-wrap items-center gap-3 text-[13px]'>
          <CalendarIcon size={22} />
          <time dateTime={new Date(publishedAt).toISOString()}>
            {formatDate(publishedAt)}
          </time>

          {viewCount !== 0 && (
            <>
              <Dot />
              <ViewCount viewCount={viewCount} />
            </>
          )}

          {commentCount !== 0 && (
            <>
              <Dot />
              <CommentCount commentCount={commentCount} />
            </>
          )}
        </div>
      </footer>
    )
  },
)

export { PostCardMeta }
