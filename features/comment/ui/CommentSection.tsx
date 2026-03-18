'use client'

import { useTranslations } from 'next-intl'

import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

import { useComments } from '@/features/comment/hook'

interface Props {
  postId?: string
  productId?: string
}

const CommentSection = ({ postId, productId }: Props) => {
  const t = useTranslations('comment')

  const { data: comments } = useComments({ postId, productId })

  return (
    <section
      aria-labelledby='comments-title'
      className='mx-auto flex w-full max-w-7xl flex-col gap-8 py-10'
    >
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-bold' id='comments-title'>
          {t('title')}
        </h2>
        <p className='text-default-500'>{t('description')}</p>
      </div>

      <div className='mb-4'>
        <CommentForm postId={postId} productId={productId} />
      </div>

      <div
        aria-label='User comments'
        className='mt-5 flex flex-col gap-6'
        role='list'
      >
        {comments?.length === 0 ? (
          <p className='text-default-400 py-10 text-center'>{t('empty')}</p>
        ) : (
          comments?.map((comment) => (
            <div key={comment.id} role='listitem'>
              <CommentItem
                comment={comment}
                postId={postId}
                productId={productId}
              />
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export { CommentSection }
