import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createOrder } from './order.action'
import { orderQueryKeys } from './order.query-key'
import { cartQueryKeys } from '../cart/cart.query-key'

const useOrderMutation = () => {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
      ])
    },
  })

  return {
    createOrder: create.mutateAsync,
    isCreating: create.isPending,
    orderData: create.data,
  }
}

export { useOrderMutation }
