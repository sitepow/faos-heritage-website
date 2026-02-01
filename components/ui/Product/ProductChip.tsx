import { Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

type ProductChipProps = {
  isAuthentic?: boolean
  isPremiumProduct?: boolean
  categoryName?: string
  className?: string
}

type ChipItem = {
  key: string
  label: string
  className?: string
  visible?: boolean
}

const ProductChip = ({
  isAuthentic = false,
  isPremiumProduct = false,
  categoryName,
  className,
}: ProductChipProps) => {
  const translateChip = useTranslations('productDetail.chips')

  const chips: ChipItem[] = [
    {
      key: 'authentic',
      label: translateChip('authentic'),
      visible: isAuthentic,
    },
    {
      key: 'premium',
      label: translateChip('premium'),
      visible: isPremiumProduct,
      className: 'bg-primary/10 text-primary',
    },
    {
      key: 'category',
      label: categoryName ?? translateChip('uncategorized'),
      visible: true,
    },
  ]

  return (
    <div className={cn('flex flex-wrap justify-center gap-1.5', className)}>
      {chips
        .filter((chip) => chip.visible)
        .map(({ key, label, className: chipClassName }) => (
          <Chip
            key={key}
            className={cn(
              'h-6 border-none bg-zinc-100 text-[10px] font-bold tracking-tighter text-zinc-500 uppercase dark:bg-zinc-800',
              chipClassName,
            )}
            radius='full'
            size='sm'
          >
            {label}
          </Chip>
        ))}
    </div>
  )
}

export { ProductChip }
