'use client'

import { Button, Textarea } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { useReviewMutation } from '../review.mutation'

import { StarRating } from '@/components/ui/StarRating'

interface Props {
  productId: string
  onSuccess?: () => void
}

const ProductReviewForm = ({ productId, onSuccess }: Props) => {
  const t = useTranslations('review')
  const { submitReview, isSubmitting } = useReviewMutation()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = async () => {
    if (rating === 0) {
      return
    }

    const result = await submitReview({
      productId,
      rating,
      comment: comment.trim(),
    })

    if (result.success) {
      setRating(0)
      setComment('')
      onSuccess?.()
    }
  }

  return (
    <div className='border-default-100 flex flex-col gap-4 rounded-xl border p-6'>
      <h4 className='text-lg font-bold'>{t('form_title')}</h4>

      <div className='flex flex-col gap-2'>
        <span className='text-default-500 text-sm'>
          {t('satisfaction_label')}
        </span>
        <StarRating
          rating={rating}
          readonly={false}
          size={32}
          onRatingChange={setRating}
        />
      </div>

      <Textarea
        label={t('comment_label')}
        placeholder={t('comment_placeholder')}
        value={comment}
        variant='bordered'
        onChange={(e) => setComment(e.target.value)}
      />

      <Button
        className='text-secondary'
        color='primary'
        disabled={rating === 0}
        isLoading={isSubmitting}
        onPress={handleSubmit}
      >
        {t('submit')}
      </Button>
    </div>
  )
}

export { ProductReviewForm }
