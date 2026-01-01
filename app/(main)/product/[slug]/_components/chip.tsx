import { Chip } from '@heroui/react'

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
  return (
    <div className='mb-2.5 flex flex-wrap gap-1'>
      {isAuthentic && <Chip variant='bordered'>Authentic 100%</Chip>}
      {isPremiumProduct && <Chip variant='bordered'>Premium Product</Chip>}
      {isDemoProduct && <Chip variant='bordered'>Demo Version</Chip>}
      {isDigitalProduct && <Chip variant='bordered'>Digital Product</Chip>}
      <Chip variant='bordered'>{categoryName ?? 'Uncategorized'}</Chip>
    </div>
  )
}
