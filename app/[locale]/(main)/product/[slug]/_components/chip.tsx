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
      {isAuthentic && (
        <Chip className='border-divider' variant='bordered'>
          {t('authentic')}
        </Chip>
      )}
      {isPremiumProduct && (
        <Chip className='border-divider' variant='bordered'>
          {t('premium')}
        </Chip>
      )}
      {isDemoProduct && (
        <Chip className='border-divider' variant='bordered'>
          {t('demo')}
        </Chip>
      )}
      {isDigitalProduct && (
        <Chip className='border-divider' variant='bordered'>
          {t('digital')}
        </Chip>
      )}
      <Chip className='border-divider' variant='bordered'>
        {categoryName ?? t('uncategorized')}
      </Chip>
    </div>
  )
}
