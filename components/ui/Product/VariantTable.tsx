/* eslint-disable react/no-array-index-key */
'use client'

import { cn } from '@heroui/react'

import type { ProductVariant } from '@/features/product/types'

import { PriceDisplay } from './PriceDisplay'

import { getProductPriceInfo } from '@/utils/product-price'

interface Props {
  variants: ProductVariant[]
  className?: string
}

const VariantTable = ({ variants, className }: Props) => {
  if (!variants || variants.length === 0) {
    return null
  }

  const sortedVariants = variants.toSorted((a, b) => {
    const nameA = a?.name ?? ''
    const nameB = b?.name ?? ''
    return nameA.localeCompare(nameB, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  })

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {sortedVariants.map((variant, idx) => {
        const priceInfo = getProductPriceInfo(variant)
        const hasDiscount = priceInfo.discountPercentage > 0

        return (
          <div
            key={`${variant.name}-${idx}`}
            className='border-default-100 flex items-center justify-between border-b p-3 last:border-b-0'
          >
            <span className='text-foreground text-lg tracking-tight uppercase sm:text-xl'>
              {variant.name}
            </span>

            <div className='flex items-center gap-2'>
              {hasDiscount && (
                <span className='rounded-full bg-red-600 px-1.5 py-0.5 text-xl font-bold text-white'>
                  -{priceInfo.discountPercentage}%
                </span>
              )}
              <span className='text-base font-bold text-red-600'>
                <PriceDisplay {...priceInfo} />
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { VariantTable }
