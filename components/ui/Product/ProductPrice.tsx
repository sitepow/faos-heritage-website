'use client'

import { useTranslations } from 'next-intl'

import type { ProductWithVariants } from '@/features/product/types'
import type { ComponentProps } from 'react'

import { useProductPrice } from '@/features/product/hook'
import { cn } from '@/utils/style'

type Props = ComponentProps<'div'> & {
  product: ProductWithVariants | null | undefined
  unit?: string
}

const ProductPrice = ({
  product,
  unit = 'item',
  className,
  ...props
}: Props) => {
  const tProductUnit = useTranslations('global.productUnit')

  const { displayPrice } = useProductPrice(product)

  return (
    <div
      className={cn('flex flex-col justify-center duration-300', className)}
      {...props}
    >
      <dl className='flex items-baseline gap-1 text-xl'>
        <dd className='font-bold'>{displayPrice}</dd>

        <dt className='text-default-500 text-sm'>
          / {tProductUnit(unit.toUpperCase())}
        </dt>
      </dl>
    </div>
  )
}

export { ProductPrice }
