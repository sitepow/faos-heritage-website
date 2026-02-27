import { useQuery } from '@tanstack/react-query'

import {
  getAddress,
  getAddresses,
  getAddressesAdmin,
  getDefaultAddress,
} from './address.action'
import { addressQueryKeys } from './address.query-key'

const useAddressesAdmin = () => {
  return useQuery({
    queryKey: addressQueryKeys.lists.admin(),
    queryFn: () => getAddressesAdmin(),
  })
}

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

const useAddress = (addressId?: string | null) => {
  return useQuery({
    queryKey: addressQueryKeys.details.byId(addressId!),
    queryFn: () => getAddress(addressId!),
    enabled: !!addressId,
  })
}

export { useAddressesAdmin, useAddresses, useDefaultAddress, useAddress }
