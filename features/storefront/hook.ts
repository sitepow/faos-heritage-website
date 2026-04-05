import { useQuery } from '@tanstack/react-query'

import {
  getActiveStorefronts,
  getMainStorefronts,
  getStorefrontInventory,
  getStorefronts,
} from './action'
import { storefrontMainKeys, storefrontQueryKeys } from './query-key'

const useMainStorefronts = () => {
  return useQuery({
    queryKey: storefrontMainKeys.active(),
    queryFn: () => {
      return getMainStorefronts()
    },
  })
}

const useStorefrontInventory = (storefrontId: string | null) => {
  return useQuery({
    queryKey: storefrontQueryKeys.inventory(storefrontId!),
    queryFn: () => {
      if (!storefrontId) return []
      return getStorefrontInventory(storefrontId)
    },
    enabled: !!storefrontId,
  })
}

const useStorefronts = () => {
  return useQuery({
    queryKey: storefrontQueryKeys.lists(),
    queryFn: () => getStorefronts(),
  })
}

const useActiveStorefronts = (
  ...args: Parameters<typeof getActiveStorefronts>
) => {
  return useQuery({
    queryKey: [...storefrontQueryKeys.active(), ...args],
    queryFn: () => {
      return getActiveStorefronts(...args)
    },
  })
}

export {
  useStorefrontInventory,
  useMainStorefronts,
  useStorefronts,
  useActiveStorefronts,
}
