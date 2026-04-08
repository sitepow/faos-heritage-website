'use client'

import { Avatar, Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { ReviewForm } from './ReviewForm'
import { useReviews } from '../hook'

import { StarRating } from '@/components/ui/StarRating'
import { formatDate } from '@/utils/date'

interface Props {
  productId: string
}

const ReviewSection = ({ productId }: Props) => {
  const t = useTranslations('review')
  const { data, isLoading } = useReviews({ productId })

  const reviews = data?.reviews || []
  const averageRating = data?.averageRating || 0
  const totalReviews = data?.totalReviews || 0
  const hasReviewed = data?.hasReviewed || false

  return (
    <section className='mx-auto flex w-full max-w-7xl flex-col gap-10'>
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xl font-bold md:text-2xl'>
            {t('title')} ({totalReviews})
          </h3>
          <div className='flex items-center gap-3'>
            <StarRating rating={averageRating} size={24} />
            <span className='text-default-600 text-lg font-semibold'>
              {averageRating.toFixed(1)} / 5.0
            </span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-12 lg:grid-cols-5'>
        <div className='order-2 flex flex-col gap-8 lg:order-1 lg:col-span-3'>
          {reviews.length === 0 ? (
            <p className='text-default-400 py-10 text-center'>{t('empty')}</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className='border-default-100 flex gap-4 border-b pb-6'
              >
                <Avatar
                  className='size-8 shrink-0 md:size-10'
                  name={review.user.name!}
                  src={review.user.image!}
                />
                <div className='flex w-full flex-col gap-2'>
                  <div className='flex flex-wrap items-start justify-between gap-2'>
                    <div className='flex flex-col gap-0.5 md:flex-row md:items-center md:gap-2'>
                      <span className='text-sm font-bold md:text-base'>
                        {review.user.name}
                      </span>
                      <span className='text-default-400 text-[10px] md:text-xs'>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {review.isVerifiedPurchase ? (
                      <Chip
                        className='h-5 text-[9px] md:h-6 md:text-[10px]'
                        color='success'
                        size='sm'
                        variant='flat'
                      >
                        {t('verified_purchase')}
                      </Chip>
                    ) : (
                      <Chip
                        className='h-5 text-[9px] md:h-6 md:text-[10px]'
                        color='default'
                        size='sm'
                        variant='bordered'
                      >
                        {t('external_purchase')}
                      </Chip>
                    )}
                  </div>

                  <StarRating rating={review.rating} size={14} />

                  <p className='text-default-700 text-sm leading-relaxed'>
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className='order-1 lg:order-2 lg:col-span-2'>
          <div className='static lg:sticky lg:top-52'>
            {!isLoading && !hasReviewed && <ReviewForm productId={productId} />}
          </div>
        </div>
      </div>
    </section>
  )
}

export { ReviewSection }
