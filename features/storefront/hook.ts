import { useQuery } from '@tanstack/react-query'

import { getActiveStorefronts, getStorefronts } from './action'
import { storefrontQueryKeys } from './query-key'

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

export { useStorefronts, useActiveStorefronts }
