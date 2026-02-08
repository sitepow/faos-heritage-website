'use client'

import { Button } from '@heroui/react'
import { XIcon } from 'lucide-react'
import { useMemo } from 'react'

import type { GetCartsResult } from '@/features/cart/cart.action'

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { ProductQty } from '@/components/ui/Product/ProductQty'
import { VariantSelect } from '@/components/ui/VariantSelect'
import { useCartItem } from '@/features/cart/hooks/useCartItem'
import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import {
  calculateTotalPrice,
  formatCurrency,
  resolveProductImages,
} from '@/utils'

type CartItemData = NonNullable<GetCartsResult>[number]

interface CartItemProps {
  cart: CartItemData
}

const CartItem = ({ cart }: CartItemProps) => {
  const { currencyOptions } = useExchangeRate()
  const { quantity, variantId, currentPrice, currentStock, loading, actions } =
    useCartItem(cart)

  const product = cart.product
  const { primarySrc } = resolveProductImages({ images: product?.images })

  const totalPrice = useMemo(
    () => calculateTotalPrice(currentPrice, quantity),
    [currentPrice, quantity],
  )

  return (
    <div className='group border-divider relative flex flex-col gap-4 border-b py-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-5'>
      <div className='flex gap-4 lg:col-span-5 lg:items-center'>
        <ProductImage
          className='size-24 object-cover lg:size-20'
          image={primarySrc}
        />

        <div className='flex flex-1 flex-col justify-center gap-1'>
          <span className='line-clamp-2 text-sm font-bold lg:text-base'>
            {product?.name}
          </span>
          <div className='lg:hidden'>
            <span className='text-default-500 text-sm'>
              {formatCurrency(currentPrice, currencyOptions)}
            </span>
          </div>
        </div>
      </div>

      <div className='hidden text-center lg:col-span-1 lg:block'>
        <span className='text-sm font-medium'>
          {formatCurrency(currentPrice, currencyOptions)}
        </span>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-4 lg:col-span-4 lg:grid lg:grid-cols-2 lg:justify-items-center'>
        <div className='w-[140px] lg:w-full'>
          <VariantSelect
            isDisabled={loading.isUpdating}
            selectedVariantId={variantId}
            variants={product?.variants ?? []}
            onChange={actions.handleVariantChange}
          />
        </div>

        <ProductQty
          currentStockQuantity={currentStock}
          handleQuantityChange={actions.handleQuantityChange}
          isDisabled={loading.isUpdating}
          quantity={quantity}
        />
      </div>

      <div className='border-divider flex items-center justify-between border-t pt-4 lg:col-span-2 lg:justify-end lg:gap-4 lg:border-none lg:pt-0'>
        <div className='flex flex-col items-start lg:items-end'>
          <span className='text-primary text-lg font-bold'>
            {formatCurrency(totalPrice, currencyOptions)}
          </span>
        </div>

        <Button
          isIconOnly
          className='transition-opacity lg:opacity-0 lg:group-hover:opacity-100'
          isDisabled={loading.isUpdating}
          isLoading={loading.isRemoving}
          size='sm'
          variant='flat'
          onPress={actions.handleDelete}
        >
          <XIcon size={18} />
        </Button>
      </div>
    </div>
  )
}

export { CartItem }
