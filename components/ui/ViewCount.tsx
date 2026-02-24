'use client'

import { EyeIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { cn, formatCompactNumber } from '@/utils'

interface Props extends ComponentProps<'div'> {
  viewCount: number
}

const ViewCount = ({ viewCount, className, ...props }: Props) => {
  const locale = useLocale()
  const t = useTranslations('common')

  if (viewCount === 0) {
    return null
  }

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <div className='flex items-center gap-1'>
        <EyeIcon />
        <span className='whitespace-nowrap'>
          {formatCompactNumber(viewCount, locale)} {t('views')}
        </span>
      </div>
    </div>
  )
}

export { ViewCount }
