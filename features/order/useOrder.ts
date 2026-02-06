import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createOrder } from './order.action'
import { orderQueryKeys } from './order.query-key'
import { cartQueryKeys } from '../cart/cart.query-key'

const useCreateOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createOrder,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cartQueryKeys.root }),
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.root }),
      ])
    },
  })
}

export { useCreateOrder }
