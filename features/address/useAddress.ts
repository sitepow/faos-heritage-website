import { useQuery } from '@tanstack/react-query'

import { getAddressByUserId, getAddresses } from './address.action'
import { addressQueryKeys } from './address.query-key'

const useAddresses = (userId?: string) => {
  return useQuery({
    queryKey: addressQueryKeys.list.all,
    queryFn: () => getAddresses(userId!),
    enabled: !!userId,
    initialData: [],
  })
}

const useAddressByUserId = (userId?: string) => {
  return useQuery({
    queryKey: addressQueryKeys.detail.byUserId(userId!),
    queryFn: () => getAddressByUserId(userId!),
    enabled: !!userId,
  })
}

export { useAddresses, useAddressByUserId }
