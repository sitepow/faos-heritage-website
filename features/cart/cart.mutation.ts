import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import { createCart, updateCart, deleteCart, clearCart } from './cart.action'
import { cartQueryKeys } from './cart.query-key'

const useCartMutation = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('messages')

  const add = useMutation({
    mutationFn: createCart,
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.all })
        toast.success(t('create_success'))
      }
    },
  })

  const update = useMutation({
    mutationFn: updateCart,
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.all })
        toast.success(t('update_success'))
      }
    },
  })

  const remove = useMutation({
    mutationFn: deleteCart,
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.all })
        toast.success(t('delete_success'))
      }
    },
  })

  const clear = useMutation({
    mutationFn: clearCart,
    onSuccess: (res) => {
      if (res) {
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.all })
        toast.success(t('delete_success'))
      }
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
