'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getContractsAdmin,
  getContractDetails,
  checkStorefrontContract,
} from './action'
import { contractQueryKeys } from './query-key'

const useContractsAdmin = () => {
  return useQuery({
    queryKey: contractQueryKeys.lists(),
    queryFn: () => getContractsAdmin(),
  })
}

const useContractDetails = (id: string) => {
  return useQuery({
    queryKey: contractQueryKeys.details(id),
    queryFn: () => getContractDetails(id),
    enabled: !!id,
  })
}

const useActiveContract = (storefrontId: string) => {
  return useQuery({
    queryKey: contractQueryKeys.active(storefrontId),
    queryFn: () => {
      return checkStorefrontContract(storefrontId)
    },
    enabled: !!storefrontId,
  })
}

export { useContractsAdmin, useContractDetails, useActiveContract }
