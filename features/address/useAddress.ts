import { useQuery } from '@tanstack/react-query'

import { getAddresses, getDefaultAddress } from './address.action'
import { addressQueryKeys } from './address.query-key'

const useAddresses = (userId?: string) => {
  return useQuery({
    queryKey: addressQueryKeys.lists.byUserId(userId!),
    queryFn: () => getAddresses(userId),
    enabled: !!userId,
    placeholderData: [],
  })
}

const useDefaultAddress = (userId?: string) => {
  return useQuery({
    queryKey: addressQueryKeys.details.defaultByUserId(userId!),
    queryFn: () => getDefaultAddress(userId),
    enabled: !!userId,
  })
}

export { useAddresses, useDefaultAddress }
