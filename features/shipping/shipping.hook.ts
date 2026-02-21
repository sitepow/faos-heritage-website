import { useQuery } from '@tanstack/react-query'

import type { GetCartsResult } from '../cart/cart.action'

import { calculateShippingCost } from './shipping.action'
import { shippingQueryKeys } from './shipping.query-key'

interface UseShippingParams {
  userId?: string
  address?: { countryCode: string } | null
  carts: GetCartsResult
}

const useShipping = ({ userId, address, carts }: UseShippingParams) => {
  const shippingItems = (carts ?? []).map((cart) => {
    const product = cart.product
    const variants = product?.variants ?? []

    const variantWeight = variants.find((v) => v.id === cart.variantId)?.weight
    const productWeight = product?.weight ?? 0

    return {
      quantity: cart.quantity ?? 0,
      weight: variantWeight ?? productWeight,
    }
  })

  const countryCode = address?.countryCode

  const query = useQuery({
    queryKey: shippingQueryKeys.costs.calculate(countryCode!, shippingItems),

    queryFn: () =>
      calculateShippingCost({
        countryCode: countryCode!,
        items: shippingItems,
      }),

    enabled: !!countryCode && shippingItems.length > 0 && !!userId,
  })

  return {
    ...query,
    shippingCost: query.data ?? 0,
  }
}

export { useShipping }
