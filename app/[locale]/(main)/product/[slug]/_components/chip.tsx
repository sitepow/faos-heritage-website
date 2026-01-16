import { Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'

type ProductChipProps = {
  isAuthentic?: boolean
  isPremiumProduct?: boolean
  isDemoProduct?: boolean
  isDigitalProduct?: boolean
  categoryName?: string
}

export const ProductChip = ({
  isAuthentic = false,
  isPremiumProduct = false,
  isDemoProduct = false,
  isDigitalProduct = false,
  categoryName,
}: ProductChipProps) => {
  const t = useTranslations('ProductChip')

  return (
    <div className='mb-2.5 flex flex-wrap gap-1'>
      {isAuthentic && <Chip variant='faded'>{t('authentic')}</Chip>}
      {isPremiumProduct && <Chip variant='faded'>{t('premium')}</Chip>}
      {isDemoProduct && <Chip variant='faded'>{t('demo')}</Chip>}
      {isDigitalProduct && <Chip variant='faded'>{t('digital')}</Chip>}
      <Chip variant='faded'>{categoryName ?? t('uncategorized')}</Chip>
    </div>
  )
}
