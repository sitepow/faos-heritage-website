'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { createAdminOrder, createOrder, sendOrderEmail } from './order.action'
import { orderQueryKeys } from './order.query-key'
import { cartQueryKeys } from '../cart/cart.query-key'

import { useAppNavigation } from '@/hooks/useAppNavigation'

const useAdminOrderMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const create = useMutation({
    mutationFn: createAdminOrder,
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: cartQueryKeys.all }),
          queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
          sendOrderEmail(result.data),
        ])

        return router.refresh()
      }
    },
  })

  return {
    createAdminOrder: create.mutateAsync,
    isCreating: create.isPending,
    orderData: create.data,
  }
}

const useOrderMutation = () => {
  const queryClient = useQueryClient()
  const navigation = useAppNavigation()

  const create = useMutation({
    mutationFn: createOrder,
    onSuccess: async (result) => {
      if (result.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: cartQueryKeys.all }),
          queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
          sendOrderEmail(result.data),
        ])

        return navigation.ORDER()
      }
    },
  })

  return {
    createOrder: create.mutateAsync,
    isCreating: create.isPending,
    orderData: create.data,
  }
}

export { useOrderMutation, useAdminOrderMutation }
