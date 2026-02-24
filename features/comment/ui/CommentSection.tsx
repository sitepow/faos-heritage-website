'use client'

import { useTranslations } from 'next-intl'

import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

import { useComments } from '@/features/comment/comment.hook'

interface Props {
  postId?: string
  productId?: string
}

const CommentSection = ({ postId, productId }: Props) => {
  const t = useTranslations('comment')

  const { data: comments } = useComments({ postId, productId })

  return (
    <section className='mx-auto flex w-full max-w-7xl flex-col gap-8 py-10'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-2xl font-bold'>{t('title')}</h3>
        <p className='text-default-500'>{t('description')}</p>
      </div>

      <CommentForm postId={postId} productId={productId} />

      <div className='mt-5 flex flex-col gap-6'>
        {comments?.length === 0 ? (
          <p className='text-default-400 py-10 text-center'>{t('empty')}</p>
        ) : (
          comments?.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              productId={productId}
            />
          ))
        )}
      </div>
    </section>
  )
}

export { CommentSection }
