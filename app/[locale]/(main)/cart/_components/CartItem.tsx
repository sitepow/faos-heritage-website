'use client'

import { Avatar, Button, Select, SelectItem } from '@heroui/react'
import { XIcon } from 'lucide-react'
import { useMemo } from 'react'

import type { GetCartResult } from '@/features/cart/cart.action'

import { ProductImage } from '@/components/ui/Product/ProductImage'
import { ProductQty } from '@/components/ui/Product/ProductQty'
import { useCartItem } from '@/features/cart/useCart'
import { useExchangeRate } from '@/features/exchangeRate/useExchangeRate'
import {
  calculateTotalPrice,
  formatCurrency,
  resolveProductImages,
} from '@/utils'

interface CartItemProps {
  cart: GetCartResult
}

const CartItem = ({ cart }: CartItemProps) => {
  const { currencyOptions } = useExchangeRate()

  const { product = { name: 'Unknown Product', variants: [], images: [] } } =
    cart || {}

  const {
    quantity = 1,
    variantId,
    currentPrice = 0,
    currentStockQuantity = 0,
    isPendingUpdateCart,
    isPendingDelete,
    handleQuantityChange,
    handleVariantChange,
    handleDeleteItem,
  } = useCartItem(cart)

  const { primarySrc } = resolveProductImages({ images: product.images })

  const totalPrice = useMemo(
    () => calculateTotalPrice(currentPrice, quantity),
    [currentPrice, quantity],
  )

  return (
    <div className='grid grid-cols-2 items-center justify-items-center gap-10 py-4 xl:grid-cols-7'>
      <ProductImage image={primarySrc} />

      <span className='line-clamp-4 font-bold'>{product.name}</span>

      <span className='text-primary font-semibold sm:text-xl'>
        {formatCurrency(currentPrice, currencyOptions)}
      </span>

      <div className='w-full'>
        {product.variants?.length > 0 && (
          <Select
            disallowEmptySelection
            aria-label='Select variant'
            radius='none'
            selectedKeys={variantId ? [variantId] : []}
            variant='bordered'
            onSelectionChange={handleVariantChange}
          >
            {product.variants.map((v) => (
              <SelectItem
                key={v.id}
                startContent={
                  <Avatar size='sm' src={v.image ?? '/images/no-image.jpg'} />
                }
              >
                {v.name}
              </SelectItem>
            ))}
          </Select>
        )}
      </div>

      <ProductQty
        currentStockQuantity={currentStockQuantity}
        handleQuantityChange={handleQuantityChange}
        isDisabled={isPendingUpdateCart}
        quantity={quantity}
      />

      <span className='text-primary font-bold sm:text-xl'>
        {formatCurrency(totalPrice, currencyOptions)}
      </span>

      <Button
        isIconOnly
        color='danger'
        isDisabled={isPendingUpdateCart}
        isLoading={isPendingDelete}
        variant='light'
        onPress={() => handleDeleteItem()}
      >
        <XIcon />
      </Button>
    </div>
  )
}

export { CartItem }
