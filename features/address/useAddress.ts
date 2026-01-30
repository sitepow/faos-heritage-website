import { useQuery } from '@tanstack/react-query'

import { getAddresses } from './address.action'
import { addressQueryKeys } from './address.query-key'

const useAddresses = (userId?: string) => {
  return useQuery({
    queryKey: addressQueryKeys.list.all,
    queryFn: () => getAddresses(userId!),
    enabled: !!userId,
    initialData: [],
  })
}

export { useAddresses }
