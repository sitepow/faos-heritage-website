'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ApplicationStatus } from '@prisma/client'

import {
  createPartnerApplication,
  updateApplicationStatus,
  upgradeSubscription,
} from './action'
import { partnerQueryKeys } from './query-key'

export const usePartnerMutation = () => {
  const queryClient = useQueryClient()

  const createApplication = useMutation({
    mutationFn: createPartnerApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerQueryKeys.all })
    },
  })

  const reviewApplication = useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: string
      status: ApplicationStatus
      adminNote?: string
    }) => updateApplicationStatus(id, status, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerQueryKeys.all })
    },
  })

  const upgrade = useMutation({
    mutationFn: upgradeSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: partnerQueryKeys.subscription.all(),
      })
    },
  })

  return {
    submitApplication: createApplication.mutateAsync,
    isSubmitting: createApplication.isPending,
    reviewApplication: reviewApplication.mutateAsync,
    isReviewing: reviewApplication.isPending,
    upgradePackage: upgrade.mutateAsync,
    isUpgrading: upgrade.isPending,
  }
}
