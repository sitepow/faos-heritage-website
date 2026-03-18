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

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {variants.slice(0, 3).map((variant, idx) => {
        const priceInfo = getProductPriceInfo(variant)
        const hasDiscount = priceInfo.discountPercentage > 0

        return (
          <div
            key={`${variant.name}-${idx}`}
            className='border-default-200 flex items-center justify-between rounded-xl border p-3'
          >
            <span className='text-foreground text-sm font-bold'>
              {variant.name}
            </span>

            <div className='flex items-center gap-2'>
              {hasDiscount && (
                <span className='rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white'>
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
