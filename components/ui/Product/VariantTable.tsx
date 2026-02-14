/* eslint-disable react/no-array-index-key */
'use client'

import { cn } from '@heroui/react'
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
                <td className='text-default-700 font-medium'>{variant.name}</td>
                <td className='text-primary text-right font-bold'>
                  {formatCurrency(variant.price, currencyOptions)}
                </td>
                {showStock && (
                  <td
                    className={cn(
                      'text-right tabular-nums',
                      isOutOfStock
                        ? 'text-danger font-medium'
                        : 'text-default-400',
                    )}
                  >
                    {isOutOfStock ? 'Out of stock' : variant.stockQuantity}
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
