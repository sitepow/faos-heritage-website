import { useDisclosure } from '@heroui/react'
import { useState, useMemo, useEffect, useCallback } from 'react'

import type { GetCartsResult } from '../action'

import { useCartMutation } from '../mutation'

import { useDebouncedChange } from '@/hooks/useDebouncedChange'
import { getProductPriceInfo } from '@/utils/product-price'

type CartItemData = NonNullable<GetCartsResult>[number]

const useCartItem = (cart: CartItemData) => {
  const [variantId, setVariantId] = useState<string | null>(
    cart?.variantId || null,
  )
  const [quantity, setQuantity] = useState<number>(cart?.quantity ?? 1)

  const {
    isOpen: isDeleteQtyOpen,
    onOpen: onOpenDelete,
    onOpenChange,
  } = useDisclosure()

  const { updateCart, removeCart, isUpdating, isRemoving } = useCartMutation()

  const debouncedUpdate = useDebouncedChange<{
    cartId: string
    quantity: number
    variantId?: string | null
  }>((payload) => {
    updateCart(payload)
  }, 500)

  const priceInfo = useMemo(
    () => getProductPriceInfo(cart.product, variantId),
    [cart.product, variantId],
  )

  const currentVariant = useMemo(
    () => cart?.product?.variants?.find((v) => v?.id === variantId),
    [cart?.product?.variants, variantId],
  )

  const state = useMemo(
    () => ({
      currentPrice: priceInfo.price,
      currentStock:
        currentVariant?.stockQuantity ?? cart?.product?.stockQuantity ?? 0,
    }),
    [
      priceInfo.price,
      currentVariant?.stockQuantity,
      cart?.product?.stockQuantity,
    ],
  )

  useEffect(() => {
    setVariantId(cart?.variantId || null)
    setQuantity(cart?.quantity ?? 1)
  }, [cart?.variantId, cart?.quantity])

  const handleUpdate = useCallback(
    (newQty: number, newVariantId: string | null) => {
      if (!cart?.id) {
        return
      }

      if (newQty === cart.quantity && newVariantId === cart.variantId) {
        return
      }

      if (newQty === 0) {
        onOpenDelete()
      } else {
        debouncedUpdate({
          cartId: cart.id,
          quantity: newQty,
          variantId: newVariantId,
        })
      }
    },
    [cart?.id, cart?.quantity, cart?.variantId, debouncedUpdate, onOpenDelete],
  )

  const handleQuantityChange = useCallback(
    (val: number) => {
      const stock = state.currentStock ?? 0
      const targetQty = val > stock ? stock : val

      setQuantity(targetQty)
      handleUpdate(targetQty, variantId)
    },
    [state.currentStock, handleUpdate, variantId],
  )

  const handleVariantChange = useCallback(
    (newVariantId: string) => {
      setVariantId(newVariantId)
      handleUpdate(quantity, newVariantId)
    },
    [handleUpdate, quantity],
  )

  const handleDelete = useCallback(() => {
    if (cart?.id) {
      removeCart(cart.id)
    }
  }, [cart?.id, removeCart])

  const actions = useMemo(
    () => ({
      handleQuantityChange,
      handleVariantChange,
      handleDelete,
    }),
    [handleQuantityChange, handleVariantChange, handleDelete],
  )

  return useMemo(
    () => ({
      quantity,
      variantId,
      ...state,
      priceInfo,
      isDeleteQtyOpen,
      onOpenChange,
      loading: {
        isUpdating,
        isRemoving,
      },
      actions,
    }),
    [
      quantity,
      variantId,
      state,
      priceInfo,
      isDeleteQtyOpen,
      onOpenChange,
      isUpdating,
      isRemoving,
      actions,
    ],
  )
}

export { useCartItem }
