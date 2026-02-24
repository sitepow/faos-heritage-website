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

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <div className='flex items-center gap-1'>
        <MessageCircle />
        <span className='whitespace-nowrap'>
          {formatCompactNumber(commentCount, locale)} {t('comments')}
        </span>
      </div>
    </div>
  )
}

export { CommentCount }
