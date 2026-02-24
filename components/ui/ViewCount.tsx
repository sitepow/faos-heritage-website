'use client'

import { EyeIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { cn } from '@/utils'

interface Props extends ComponentProps<'div'> {
  viewCount: number
  iconSize?: number
}

const ViewCount = ({
  viewCount,
  className,
  iconSize = 22,
  ...props
}: Props) => {
  const locale = useLocale()
  const t = useTranslations('common')

  if (viewCount === 0) {
    return null
  }

  const formattedCount = new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(viewCount)

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <div className='flex items-center gap-1'>
        <EyeIcon size={iconSize} />
        <span className='whitespace-nowrap'>
          {formattedCount} {t('views')}
        </span>
      </div>
    </div>
  )
}

export { ViewCount }
