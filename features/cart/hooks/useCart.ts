import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { getCarts, getCartStat } from '../cart.action'
import { cartQueryKeys } from '../cart.query-key'

const useCarts = ({ userId }: { userId?: string }) => {
  const query = useQuery({
    queryKey: cartQueryKeys.lists.byUserId(userId!),
    queryFn: () => getCarts(userId!),
    enabled: !!userId,
  })

  const subTotal = useMemo(() => {
    const items = query.data ?? []
    return items.reduce((sum, cart) => {
      const variant = cart?.product?.variants?.find(
        (v) => v.id === cart?.variantId,
      )
      const price = variant?.price ?? cart?.product?.price ?? 0
      return sum + price * (cart.quantity ?? 0)
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
    queryKey: cartQueryKeys.stats.byUserId(userId!),
    queryFn: () => getCartStat(),
    enabled: !!userId,
  })
}

export { useCarts, useCartStat }
