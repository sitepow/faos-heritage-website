import { useDisclosure } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState, useMemo, useEffect } from 'react'

import type { GetCartResult } from './cart.action'

import {
  clearCart,
  deleteCart,
  getCarts,
  getCartStat,
  updateCart,
} from './cart.action'
import { cartQueryKeys } from './cart.query-key'
import { useCartStore } from './cart.store'
import { productQueryKeys } from '../product/product.query-key'

const useCarts = ({ userId }: { userId?: string }) => {
  const query = useQuery({
    queryKey: cartQueryKeys.list.all({ userId }),
    queryFn: async () => getCarts(userId!),
    enabled: !!userId,
  })

  const subTotal = useMemo(() => {
    const items = query.data ?? []
    return items.reduce((sum, cart) => {
      const variants = cart?.product?.variants ?? []
      const variant = variants.find((v) => v.id === cart?.variantId)
      const price = variant?.price ?? cart?.product?.price ?? 0
      return sum + price * cart.quantity
    }, 0)
  }, [query.data])

  return {
    ...query,
    subTotal,
    isEmpty: (query.data ?? []).length === 0,
  }
}

const useCartStat = ({ userId }: { userId?: string }) => {
  return useQuery({
    queryKey: cartQueryKeys.stat.byUser({ userId }),
    queryFn: () => getCartStat(userId!),
    enabled: !!userId,
  })
}

const useDeleteCart = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
  const { setState } = useCartStore()

  return useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.root })
      setState({ cartId: null })
      onSuccess?.()
    },
  })
}

const useClearCart = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.root })
      onSuccess?.()
    },
  })
}

const useUpdateCart = ({ productId }: { productId: string }) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: productQueryKeys.detail.byId(productId),
        }),
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.root }),
      ])
    },
  })
}

const useCartItem = (cart: GetCartResult) => {
  const [variantId, setVariantId] = useState<string | null>(
    cart?.variantId || null,
  )
  const [quantity, setQuantity] = useState(cart?.quantity)

  const {
    isOpen: isDeleteQtyOpen,
    onOpen: onOpenDelete,
    onOpenChange: onOpenDeleteQtyChange,
  } = useDisclosure()
  const { mutate: mutateUpdateCart, isPending: isPendingUpdateCart } =
    useUpdateCart({ productId: cart?.productId! })

  const { mutate: mutateDeleteCart, isPending: isPendingDelete } =
    useDeleteCart()

  const handleDeleteItem = () => {
    if (cart?.id) {
      mutateDeleteCart(cart.id)
    }
  }

  const currentVariant = useMemo(() => {
    return cart?.product?.variants?.find((v) => v?.id === variantId)
  }, [cart?.product?.variants, variantId])

  const currentPrice = currentVariant?.price ?? cart?.product?.price
  const currentStockQuantity =
    currentVariant?.stockQuantity ?? cart?.product?.stockQuantity

  useEffect(() => {
    if (cart?.variantId) {
      setVariantId(cart?.variantId)
    }

    setQuantity(cart?.quantity)
  }, [cart?.variantId, cart?.quantity])

  useEffect(() => {
    if (!cart?.id || quantity === cart?.quantity) {
      return
    }

    const handler = setTimeout(() => {
      if (quantity === 0) {
        onOpenDelete()
        return
      }

      mutateUpdateCart({
        cartId: cart?.id,
        quantity: Number(quantity),
        variantId: variantId!,
      })
    }, 500)

    return () => clearTimeout(handler)
  }, [
    quantity,
    cart?.id,
    cart?.quantity,
    variantId,
    mutateUpdateCart,

    onOpenDelete,
  ])

  const handleQuantityChange = (value: unknown) => {
    const newQty = Number(value)
    if (newQty > (currentStockQuantity ?? 0)) {
      setQuantity(currentStockQuantity)
      return
    }
    if (newQty <= 0) {
      onOpenDelete()
      return
    }
    setQuantity(newQty)
  }

  const handleVariantChange = (keys: any) => {
    const selected = Array.from(keys)[0] as string
    setVariantId(selected)
    if (cart?.id) {
      mutateUpdateCart({
        cartId: cart?.id,
        quantity: Number(quantity),
        variantId: selected,
      })
    }
  }

  return {
    quantity,
    variantId,
    currentPrice,
    currentStockQuantity,
    isDeleteQtyOpen,
    isPendingUpdateCart,
    isPendingDelete,
    onOpenDeleteQtyChange,
    handleQuantityChange,
    handleVariantChange,
    handleDeleteItem,
    mutateUpdateCart,
  }
}

export {
  useCarts,
  useCartStat,
  useDeleteCart,
  useClearCart,
  useUpdateCart,
  useCartItem,
}
