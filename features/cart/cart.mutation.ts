import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createCart, updateCart, deleteCart, clearCart } from './cart.action'
import { cartQueryKeys } from './cart.query-key'

const useCartMutation = () => {
  const queryClient = useQueryClient()

  const add = useMutation({
    mutationFn: createCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.all })
    },
  })

  const update = useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.all })
    },
  })

  const remove = useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.all })
    },
  })

  const clear = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartQueryKeys.all })
    },
  })

  return {
    addToCart: add.mutateAsync,
    isAdding: add.isPending,
    updateCart: update.mutateAsync,
    isUpdating: update.isPending,
    removeCart: remove.mutateAsync,
    isRemoving: remove.isPending,
    clearCart: clear.mutateAsync,
    isClearing: clear.isPending,
  }
}

export { useCartMutation }
