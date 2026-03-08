'use client'

import { useQuery } from '@tanstack/react-query'

import { getStockHistoryByProductId } from './stock-history.action'
import { stockHistoryQueryKeys } from './stock-history.query-key'

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
