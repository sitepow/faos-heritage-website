'use client'

import { useTranslations } from 'next-intl'

import type { ComponentProps } from 'react'

import { useProductPrice } from '@/features/product/useProduct'
import { cn } from '@/utils/style'

type Props = ComponentProps<'div'> & {
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
}: Props) => {
  const translateProductUnit = useTranslations('global.productUnit')

  const { displayPrice } = useProductPrice({
    price,
    priceMin,
    priceMax,
  })

  return (
    <div
      className={cn('flex flex-col justify-center duration-300', className)}
      {...props}
    >
      <dl className='flex items-baseline gap-1 text-xl'>
        <dd>{displayPrice}</dd>

        <dt>/ {translateProductUnit(unit.toUpperCase())}</dt>
      </dl>
    </div>
  )
}

export { ProductPrice }
