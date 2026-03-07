'use client'

import { Package } from 'lucide-react'

import { PriceDisplay } from '../Product/PriceDisplay'
import { ProductImage } from '../Product/ProductImage'

import { IMAGE_FALLBACK } from '@/constants'
import { cn } from '@/utils/style'

interface OrderItemMinimal {
  id: string
  productName: string
  variantName?: string | null
  quantity: number
  subtotal: number | string
  product?: {
    images?: { url: string }[]
    unit?: string | null
    name?: string | null
  } | null
}

interface Props {
  items: OrderItemMinimal[]
  title: string
}

const OrderItems = ({ items, title }: Props) => {
  return (
    <div className='space-y-4 text-left'>
      <div className='flex items-center gap-2 font-semibold'>
        <Package size={22} />
        <span>{title}</span>
      </div>

      <div className='flex flex-col'>
        {items?.map((item) => {
          return (
            <div
              key={item.id}
              className={cn(
                'border-default-100 flex items-center gap-4 border-b py-4',
                'first:pt-0 last:border-0 last:pb-0',
              )}
            >
              <ProductImage
                className='size-20 flex-shrink-0'
                image={item.product?.images?.[0]?.url || IMAGE_FALLBACK.EMPTY}
              />

              <div className='min-w-0 flex-1'>
                <p className='text-default-700 line-clamp-2 text-sm font-medium'>
                  {item.productName}
                </p>
                <p className='text-default-500 mt-0.5 text-xs'>
                  {item.variantName ? `${item.variantName} • ` : ''}
                  {item.quantity} {item.product?.unit || 'ชิ้น'}
                </p>
              </div>

              <PriceDisplay price={Number(item.subtotal)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { OrderItems }
