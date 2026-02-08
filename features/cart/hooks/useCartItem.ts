import { useDisclosure } from '@heroui/react'
import { useState, useMemo, useEffect } from 'react'

import type { GetCartsResult } from '../cart.action'

import { useCartMutation } from '../cart.mutation'

import { useDebouncedChange } from '@/hooks/useDebouncedChange'

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
    variantId: string
  }>((payload) => {
    updateCart(payload)
  }, 500)

  const currentVariant = useMemo(
    () => cart?.product?.variants?.find((v) => v?.id === variantId),
    [cart?.product?.variants, variantId],
  )

  const state = {
    currentPrice: currentVariant?.price ?? cart?.product?.price ?? 0,
    currentStock:
      currentVariant?.stockQuantity ?? cart?.product?.stockQuantity ?? 0,
  }

  useEffect(() => {
    setVariantId(cart?.variantId || null)
    setQuantity(cart?.quantity ?? 1)
  }, [cart?.variantId, cart?.quantity])

  const handleUpdate = (newQty: number, newVariantId: string | null) => {
    if (!cart?.id || !newVariantId) {
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
  }

  const actions = {
    handleQuantityChange: (val: number) => {
      const stock = state.currentStock ?? 0
      const targetQty = val > stock ? stock : val

      setQuantity(targetQty)
      handleUpdate(targetQty, variantId)
    },
    handleVariantChange: (newVariantId: string) => {
      setVariantId(newVariantId)
      handleUpdate(quantity, newVariantId)
    },
    handleDelete: () => cart?.id && removeCart(cart.id),
  }

  return {
    quantity,
    variantId,
    ...state,
    isDeleteQtyOpen,
    onOpenChange,
    loading: {
      isUpdating,
      isRemoving,
    },
    actions,
  }
}

export { useCartItem }
