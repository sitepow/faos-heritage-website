'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getCurrentSubscription,
  getMyApplication,
  getPartnerApplicationsAdmin,
} from './action'
import { partnerQueryKeys } from './query-key'

export const usePartnerApplicationsAdmin = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: partnerQueryKeys.lists.filtered({ page, limit }),
    queryFn: () => getPartnerApplicationsAdmin(page, limit),
  })
}

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: partnerQueryKeys.subscription.current(),
    queryFn: () => getCurrentSubscription(),
  })
}

export const useMyApplication = () => {
  return useQuery({
    queryKey: partnerQueryKeys.lists.mine(),
    queryFn: () => getMyApplication(),
  })
}
