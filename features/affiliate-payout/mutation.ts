'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createAffiliatePayout } from './action'
import { payoutQueryKeys } from './query-key'
import { affiliateQueryKeys } from '../affiliate/query-key'

const usePayoutMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: createAffiliatePayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payoutQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: affiliateQueryKeys.lists() })
    },
  })

  return { create, isCreating }
}

export { usePayoutMutation }
