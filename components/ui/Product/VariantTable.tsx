/* eslint-disable react/no-array-index-key */
'use client'

import { Chip, cn } from '@heroui/react'
import { useTranslations } from 'next-intl'

import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import { formatCurrency } from '@/utils'

interface ProductVariant {
  name: string
  price: number
  stockQuantity: number
  image?: string | null
}

interface Props {
  variants: ProductVariant[]
  className?: string
  showStock?: boolean
}

const VariantTable = ({ variants, className, showStock = true }: Props) => {
  const t = useTranslations('variantTable')
  const tProductDetail = useTranslations('productDetail')

  const { currencyOptions } = useExchangeRate()

  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'border-divider bg-content1/50 w-full overflow-hidden border',
        className,
      )}
    >
      <table className='w-full text-left text-xs'>
        <thead>
          <tr className='border-divider bg-default-100/50 text-default-500 border-b tracking-wider uppercase *:px-3 *:py-2.5 *:font-semibold'>
            <th>{t('size')}</th>
            <th className='text-right'>{t('price')}</th>
            {showStock && <th className='text-right'>{t('stock')}</th>}
          </tr>
        </thead>
        <tbody className='divide-divider divide-y'>
          {variants.map((variant, idx) => {
            const isOutOfStock = variant.stockQuantity <= 0

            return (
              <tr
                key={`${variant.name}-${idx}`}
                className='hover:bg-default-100/30 transition-colors *:px-3 *:py-2.5'
              >
                <td className='text-default-700 font-bold'>{variant.name}</td>
                <td className='text-default-700 text-right font-bold'>
                  {formatCurrency(variant.price, currencyOptions)}
                </td>
                {showStock && (
                  <td className={'text-right'}>
                    <Chip
                      color={isOutOfStock ? 'danger' : 'success'}
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
export type { ProductVariant }
