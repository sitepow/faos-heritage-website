'use client'

import { useQuery } from '@tanstack/react-query'

import { getStockHistoryByProductId } from './action'
import { stockHistoryQueryKeys } from './query-key'

const useStockHistory = (productId: string, page = 1) => {
  return useQuery({
    queryKey: stockHistoryQueryKeys.list(productId, page),
    queryFn: () => {
      return getStockHistoryByProductId(productId, page)
    },
    enabled: !!productId,
  })
}

export { useStockHistory }
