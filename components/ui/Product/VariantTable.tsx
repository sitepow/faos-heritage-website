/* eslint-disable react/no-array-index-key */
'use client'

import { Chip, cn } from '@heroui/react'
import { useTranslations } from 'next-intl'

import type { ProductVariant } from '@/features/product/product.types'

import { PriceDisplay } from '@/components/ui/Product/PriceDisplay'
import { getProductPriceInfo } from '@/utils/product-price'

interface Props {
  variants: ProductVariant[]
  className?: string
  showStock?: boolean
}

const VariantTable = ({ variants, className, showStock = true }: Props) => {
  const t = useTranslations('variantTable')
  const tProductDetail = useTranslations('productDetail')

  if (!variants || variants.length === 0) {
    return null
  }

  const stickyBorderClass =
    'after:content-[""] after:absolute after:top-0 after:right-0 after:h-full after:w-[1px] after:bg-default-100'

  return (
    <div
      className={cn(
        'border-default-100 w-full min-w-[400px] overflow-x-auto border',
        className,
      )}
    >
      <table className='w-full min-w-[400px] border-separate border-spacing-0 text-left text-xs'>
        <caption className='sr-only'>Product Variants</caption>

        <thead>
          <tr className='border-default-100 *:border-default-100 text-default-500 border-b tracking-wider uppercase *:border-b *:px-3 *:py-2.5 *:font-semibold'>
            <th
              className={cn(
                'sticky left-0 z-10 backdrop-blur-md',
                stickyBorderClass,
              )}
              scope='col'
            >
              {t('size')}
            </th>
            <th className='text-right' scope='col'>
              {t('price')}
            </th>
            {showStock && (
              <th className='text-right' scope='col'>
                {t('stock')}
              </th>
            )}
          </tr>
        </thead>

        <tbody className='divide-default-100 divide-y'>
          {variants.map((variant, idx) => {
            const stock = variant.stockQuantity ?? 0
            const isOutOfStock = stock <= 0
            const priceInfo = getProductPriceInfo(variant)

            return (
              <tr key={`${variant.name}-${idx}`} className='*:px-3 *:py-2.5'>
                <th
                  className={cn(
                    'text-default-700 bg-content1/50 sticky left-0 z-10 font-medium backdrop-blur-md',
                    stickyBorderClass,
                  )}
                  scope='row'
                >
                  {variant.name}
                </th>
                <td className='text-right'>
                  <PriceDisplay {...priceInfo} />
                </td>
                {showStock && (
                  <td className='text-right'>
                    <Chip
                      color={isOutOfStock ? 'danger' : 'success'}
                      size='sm'
                      variant='dot'
                    >
                      {isOutOfStock
                        ? tProductDetail('cartActions.outOfStock')
                        : tProductDetail('cartActions.inStock')}
                    </Chip>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export { VariantTable }
