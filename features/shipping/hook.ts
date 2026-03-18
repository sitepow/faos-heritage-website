'use client'

import { useQuery } from '@tanstack/react-query'

import type { GetCartsResult } from '../cart/action'

import {
  calculateShippingCost,
  getShippingCountries,
  getShippingCountry,
  getShippingStatAdmin,
} from './action'
import { shippingQueryKeys } from './query-key'

interface UseShippingParams {
  userId?: string
  address?: { countryCode: string } | null
  carts: GetCartsResult
}

const useShippingCountriesAdmin = () => {
  return useQuery({
    queryKey: shippingQueryKeys.lists.all(),
    queryFn: () => getShippingCountries(),
  })
}

const useShippingCountry = (id: string | null) => {
  return useQuery({
    queryKey: shippingQueryKeys.details.byId(id || ''),
    queryFn: () => getShippingCountry(id!),
    enabled: !!id,
  })
}

const useShipping = ({ userId, address, carts }: UseShippingParams) => {
  const shippingItems = (carts ?? []).map((cart) => {
    const product = cart.product
    const variants = product?.variants ?? []

    const variantWeight = variants.find((v) => v.id === cart.variantId)?.weight
    const productWeight = product?.weight ?? 0

    return {
      quantity: cart.quantity ?? 0,
      weight: Number(variantWeight ?? productWeight),
    }
  })

  const totalPrice = (carts ?? []).reduce((sum, cart) => {
    const product = cart.product
    const variants = product?.variants ?? []

    const variantPrice = variants.find((v) => v.id === cart.variantId)?.price
    const productPrice = product?.price ?? 0
    const price = Number(variantPrice ?? productPrice)

    return sum + price * (cart.quantity ?? 0)
  }, 0)

  const countryCode = address?.countryCode

  const query = useQuery({
    queryKey: shippingQueryKeys.costs.calculate(countryCode!, shippingItems),

    queryFn: () =>
      calculateShippingCost({
        countryCode: countryCode!,
        items: shippingItems,
        totalPrice: totalPrice,
      }),

    enabled: !!countryCode && shippingItems.length > 0 && !!userId,
  })

  return {
    ...query,
    shippingCost: query.data ?? 0,
  }
}

const useShippingStatAdmin = () => {
  return useQuery({
    queryKey: shippingQueryKeys.stats(),
    queryFn: () => getShippingStatAdmin(),
  })
}

export {
  useShippingCountriesAdmin,
  useShippingCountry,
  useShipping,
  useShippingStatAdmin,
}
