'use client'

import { Button, Textarea } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { useCommentMutation } from '@/features/comment/comment.mutation'
import { cn } from '@/utils'

interface Props {
  postId: string
  parentId?: string | null
  onSuccess?: () => void
  isReply?: boolean
}

const CommentForm = ({
  postId,
  parentId = null,
  onSuccess,
  isReply = false,
}: Props) => {
  const t = useTranslations('comment')
  const tActions = useTranslations('actions')

  const [content, setContent] = useState('')

  const { create, isCreating } = useCommentMutation()

  const handleSubmit = async () => {
    if (!content.trim()) {
      return
    }

    const result = await create({
      content,
      postId,
      parentId,
    })

    if (result.success) {
      setContent('')
      if (onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', isReply && 'mt-2')}>
      <Textarea
        classNames={{
          inputWrapper: 'bg-background',
        }}
        minRows={isReply ? 1 : 3}
        placeholder={isReply ? t('reply_placeholder') : t('placeholder')}
        value={content}
        variant='bordered'
        onChange={(e) => setContent(e.target.value)}
      />
      <div className='flex justify-end gap-2'>
        {isReply && (
          <Button
            disabled={isCreating}
            size='sm'
            variant='light'
            onPress={onSuccess}
          >
            {tActions('cancel')}
          </Button>
        )}
        <Button
          className='text-secondary'
          color='primary'
          disabled={!content.trim()}
          isLoading={isCreating}
          size={isReply ? 'sm' : 'md'}
          onPress={handleSubmit}
        >
          {isReply ? t('reply_submit') : t('submit')}
        </Button>
      </div>
    </div>
  )
}

export { CommentForm }
