'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AffiliateStatus } from '@prisma/client'

import { registerAffiliate, updateAffiliateStatus } from './action'
import { affiliateQueryKeys } from './query-key'

const useAffiliateMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AffiliateStatus }) => {
      return updateAffiliateStatus(id, status)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: affiliateQueryKeys.all })
    },
  })

  const { mutateAsync: register, isPending: isRegistering } = useMutation({
    mutationFn: registerAffiliate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: affiliateQueryKeys.all })
    },
  })

  return {
    updateStatus,
    register,
    isUpdating,
    isRegistering,
  }
}

export { useAffiliateMutation }
