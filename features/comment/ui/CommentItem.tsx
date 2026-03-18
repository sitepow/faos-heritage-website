'use client'

import { Avatar, Button, useDisclosure } from '@heroui/react'
import { ReplyIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import type { getComments } from '@/features/comment/action'

import { CommentForm } from './CommentForm'

import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal'
import { useCommentMutation } from '@/features/comment/mutation'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/date'

type CommentWithUser = Awaited<ReturnType<typeof getComments>>[number]

interface Props {
  comment: CommentWithUser
  postId?: string
  productId?: string
  parentUserName?: string | null
}

const CommentItem = ({ comment, postId, productId, parentUserName }: Props) => {
  const t = useTranslations('comment')
  const tActions = useTranslations('actions')

  const { userId, isAdmin } = useAuth()
  const { remove, isRemoving } = useCommentMutation()

  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isReplying, setIsReplying] = useState(false)

  const canDelete = isAdmin || userId === comment.userId
  const toggleReply = () => setIsReplying(!isReplying)

  const handleConfirmDelete = async () => {
    const result = await remove(comment.id)
    if (result.success) onOpenChange()
  }

  return (
    <article className='flex flex-col gap-4'>
      <div className='flex gap-4'>
        <Avatar
          className='size-10 shrink-0'
          name={comment?.user?.name!}
          src={comment?.user?.image!}
        />
        <div className='flex w-full max-w-96 flex-col gap-1 break-words'>
          <div className='border-default-100 group relative rounded-2xl border px-4 py-2'>
            <header className='mb-1 flex flex-col'>
              <address className='not-italic'>
                <span className='text-sm font-semibold'>
                  {comment.user?.name}
                </span>
              </address>
            </header>

            <p className='text-default-700 text-sm whitespace-pre-wrap'>
              {parentUserName && (
                <span className='text-primary mr-1 font-bold'>
                  @{parentUserName}
                </span>
              )}
              {comment.content}
            </p>
          </div>

          <footer className='text-default-500 flex flex-wrap items-center gap-4 pl-2 text-xs'>
            <time dateTime={comment.createdAt.toISOString()}>
              {formatDate(comment.createdAt)}
            </time>

            <Button
              aria-label={`Reply to ${comment.user?.name}`}
              color='primary'
              size='sm'
              startContent={<ReplyIcon size={14} />}
              variant='light'
              onPress={toggleReply}
            >
              {t('reply')}
            </Button>

            {canDelete && (
              <Button
                color='danger'
                size='sm'
                startContent={<XIcon size={14} />}
                variant='light'
                onPress={onOpen}
              >
                {tActions('delete')}
              </Button>
            )}
          </footer>
        </div>
      </div>

      {isReplying && (
        <section aria-label='Write a reply' className='ml-14'>
          <CommentForm
            isReply
            parentId={comment.id}
            postId={postId}
            productId={productId}
            onSuccess={() => setIsReplying(false)}
          />
        </section>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div
          aria-label='Replies'
          className='border-default-100 ml-14 flex flex-col gap-4 border-l-2 pl-4'
          role='group'
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply as CommentWithUser}
              parentUserName={comment.user?.name}
              postId={postId}
              productId={productId}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isOpen}
        isPending={isRemoving}
        onConfirm={handleConfirmDelete}
        onOpenChange={onOpenChange}
      />
    </article>
  )
}

export { CommentItem }
