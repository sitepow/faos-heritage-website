'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getStorefrontInventories,
  getStorefrontInventoryDetail,
} from './storefront-inventory.action'
import { storefrontInventoryKeys } from './storefront-inventory.query-key'

interface UseStorefrontInventoryParams {
  storefrontId: string
}

const useStorefrontInventories = ({
  storefrontId,
}: UseStorefrontInventoryParams) => {
  return useQuery({
    queryKey: storefrontInventoryKeys.byStore(storefrontId),
    queryFn: () => {
      return getStorefrontInventories(storefrontId)
    },
    enabled: !!storefrontId,
  })
}

const useStorefrontInventoryDetail = (id: string) => {
  return useQuery({
    queryKey: storefrontInventoryKeys.detail(id),
    queryFn: () => {
      return getStorefrontInventoryDetail(id)
    },
    enabled: !!id,
  })
}

export { useStorefrontInventories, useStorefrontInventoryDetail }
