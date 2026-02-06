import { useQuery } from '@tanstack/react-query'

import type { GetCartResult } from '../cart/cart.action'

import { calculateShippingCost } from './shipping.action'
import { shippingQueryKeys } from './shipping.query-key'

interface UseShippingParams {
  userId?: string
  address?: { countryCode: string } | null
  carts: GetCartResult[]
}

const useShipping = ({ userId, address, carts }: UseShippingParams) => {
  const query = useQuery({
    queryKey: shippingQueryKeys.cost.byUserId(
      userId!,
      address?.countryCode,
      carts.map((c) => ({ id: c.id, q: c.quantity })),
    ),
    queryFn: () =>
      calculateShippingCost({
        countryCode: address!.countryCode,
        items: carts.map((cart) => ({
          quantity: cart.quantity,
          weight:
            cart.product?.variants?.find(
              (variant) => variant.id === cart.variantId,
            )?.weight ??
            cart.product?.weight ??
            0,
        })),
      }),
    enabled: !!address?.countryCode && carts.length > 0 && !!userId,
  })

  return {
    ...query,
    shippingCost: query.data ?? 0,
  }
}

export { useShipping }
