'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { processStockAdjustment } from './action'
import { stockQueryKeys } from './query-key'
import { productVariantQueryKeys } from '../product-variant/query-key'
import { stockHistoryQueryKeys } from '../stock-history/query-key'

import { productQueryKeys } from '@/features/product/query-key'

const useStockMutation = () => {
  const queryClient = useQueryClient()

  const adjustment = useMutation({
    mutationFn: processStockAdjustment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: stockQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: productVariantQueryKeys.all,
      })
      queryClient.invalidateQueries({
        queryKey: stockHistoryQueryKeys.all,
      })
    },
  })

  return {
    adjustStock: adjustment.mutateAsync,
    isPending: adjustment.isPending,
  }
}

export { useStockMutation }
