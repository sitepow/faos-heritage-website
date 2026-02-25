'use client'

import { MessageCircle } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { cn, formatCompactNumber } from '@/utils'

interface Props extends ComponentProps<'div'> {
  commentCount: number
}

const CommentCount = ({ commentCount, className, ...props }: Props) => {
  const locale = useLocale()
  const t = useTranslations('common')

  const formattedCount = formatCompactNumber(commentCount, locale)

  return (
    <div
      aria-label={`${formattedCount} ${t('comments')}`}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <div className='flex items-center gap-1'>
        <MessageCircle aria-hidden='true' size={16} />
        <span className='whitespace-nowrap'>
          {formattedCount} {t('comments')}
        </span>
      </div>
    </div>
  )
}

export { CommentCount }
