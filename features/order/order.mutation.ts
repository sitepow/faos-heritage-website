import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

import { createOrder } from './order.action'
import { orderQueryKeys } from './order.query-key'
import { cartQueryKeys } from '../cart/cart.query-key'

const useOrderMutation = () => {
  const queryClient = useQueryClient()
  const t = useTranslations('messages')

  const create = useMutation({
    mutationFn: createOrder,
    onSuccess: async (res) => {
      if (res) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: cartQueryKeys.all }),
          queryClient.invalidateQueries({ queryKey: orderQueryKeys.all }),
        ])

        toast.success(t('create_success'))
      }
    },
  })

  return {
    createOrder: create.mutateAsync,
    isCreating: create.isPending,
    orderData: create.data,
  }
}

export { useOrderMutation }
