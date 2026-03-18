import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { getCarts, getCartStat } from '../action'
import { cartQueryKeys } from '../query-key'

import { getProductPriceInfo } from '@/utils/product-price'

interface useCartsProps {
  userId?: string
  locale?: string
}

const useCarts = ({ userId, locale }: useCartsProps) => {
  const query = useQuery({
    queryKey: cartQueryKeys.lists.byUserId({ userId: userId!, locale }),
    queryFn: () => getCarts(userId!, locale),
    enabled: !!userId,
  })

  const totals = useMemo(() => {
    const items = query.data ?? []

    return items.reduce(
      (acc, cart) => {
        const { price, originalPrice, discountAmount } = getProductPriceInfo(
          cart.product,
          cart.variantId,
        )

        const variant = cart?.product?.variants?.find(
          (v) => v.id === cart.variantId,
        )
        const weight = variant?.weight ?? cart?.product?.weight ?? 0

        const qty = cart.quantity ?? 0

        acc.grossTotal += originalPrice * qty
        acc.subTotal += price * qty
        acc.totalDiscount += discountAmount * qty
        acc.totalWeight += weight * qty

        return acc
      },
      { grossTotal: 0, subTotal: 0, totalDiscount: 0, totalWeight: 0 },
    )
  }, [query.data])

  return {
    ...query,
    ...totals,
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
