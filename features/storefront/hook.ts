import { useQuery } from '@tanstack/react-query'

import {
  getActiveStorefronts,
  getMainStorefronts,
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

const useStorefronts = () => {
  return useQuery({
    queryKey: storefrontQueryKeys.lists(),
    queryFn: () => getStorefronts(),
  })
}

const useActiveStorefronts = () => {
  return useQuery({
    queryKey: storefrontQueryKeys.active(),
    queryFn: () => getActiveStorefronts(),
  })
}

export { useMainStorefronts, useStorefronts, useActiveStorefronts }
