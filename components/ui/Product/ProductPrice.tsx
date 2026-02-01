'use client'

import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { useProductPrice } from '@/features/product/useProduct'
import { cn } from '@/utils/style'

type ProductPriceProps = ComponentProps<'div'> & {
  price: number
  priceMin: number | null
  priceMax: number | null
  unit?: string
}

const ProductPrice = ({
  price,
  priceMin,
  priceMax,
  unit = 'item',
  className,
  ...props
}: ProductPriceProps) => {
  const translateProductUnit = useTranslations('global.productUnit')

  const { displayPrice } = useProductPrice({
    price,
    priceMin,
    priceMax,
  })

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center duration-300',
        className,
      )}
      {...props}
    >
      <dl className='flex items-baseline gap-1'>
        <dd className='text-2xl tracking-tighter'>{displayPrice}</dd>

        <dt className='text-[10px] font-bold tracking-widest uppercase'>
          / {translateProductUnit(unit.toUpperCase())}
        </dt>
      </dl>
    </div>
  )
}

export { ProductPrice }
