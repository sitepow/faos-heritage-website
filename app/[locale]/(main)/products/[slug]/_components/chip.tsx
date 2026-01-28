import { Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/style'

type ProductChipProps = {
  isAuthentic?: boolean
  isPremiumProduct?: boolean
  categoryName?: string
  className?: string
}

export const ProductChip = ({
  isAuthentic = false,
  isPremiumProduct = false,
  categoryName,
  className,
}: ProductChipProps) => {
  const t = useTranslations('ProductChip')

  const chipClass =
    'h-6 border-none bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold text-[10px] uppercase tracking-tighter'

  return (
    <div className={cn('flex flex-wrap justify-center gap-1.5', className)}>
      {isAuthentic && (
        <Chip className={chipClass} radius='full' size='sm'>
          {t('authentic')}
        </Chip>
      )}
      {isPremiumProduct && (
        <Chip
          className={cn(chipClass, 'bg-primary/10 text-primary')}
          radius='full'
          size='sm'
        >
          {t('premium')}
        </Chip>
      )}
      <Chip className={chipClass} radius='full' size='sm'>
        {categoryName ?? t('uncategorized')}
      </Chip>
    </div>
  )
}
