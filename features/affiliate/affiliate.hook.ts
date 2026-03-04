'use client'

import { useQuery } from '@tanstack/react-query'

import { getAffiliateProfile, getAffiliates } from './affiliate.action'
import { affiliateQueryKeys } from './affiliate.query-key'

const useAffiliates = () => {
  return useQuery({
    queryKey: affiliateQueryKeys.lists(),
    queryFn: () => {
      return getAffiliates()
    },
  })
}

const useAffiliateProfile = () => {
  return useQuery({
    queryKey: affiliateQueryKeys.profile(),
    queryFn: () => {
      return getAffiliateProfile()
    },
  })
}

export { useAffiliates, useAffiliateProfile }
