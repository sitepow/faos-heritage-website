'use client'

import { PayoutStatus } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import {
  getPendingPayouts,
  getAffiliateCommissions,
  getWithdrawableAmountByDate,
  getAffiliatePayouts,
} from './action'
import { payoutQueryKeys } from './query-key'
import { calculateCommissionByStatus } from './util'

interface UsePendingPayoutsParams {
  affiliateId?: string
  startDate?: string
  endDate?: string
}

interface UseWithdrawableParams {
  affiliateId: string
  startDate?: string
  endDate?: string
  selectedIds?: string[]
}

const usePendingPayouts = ({
  affiliateId,
  startDate,
  endDate,
}: UsePendingPayoutsParams = {}) => {
  return useQuery({
    queryKey: [...payoutQueryKeys.pending(startDate, endDate), affiliateId],
    queryFn: () => {
      return getPendingPayouts({ affiliateId, startDate, endDate })
    },
  })
}

const useAffiliateCommissions = (affiliateId: string) => {
  return useQuery({
    queryKey: payoutQueryKeys.commissions(affiliateId),
    queryFn: () => {
      return getAffiliateCommissions(affiliateId)
    },
    enabled: !!affiliateId,
  })
}

const useWithdrawableAmount = ({
  affiliateId,
  startDate,
  endDate,
  selectedIds,
}: UseWithdrawableParams) => {
  return useQuery({
    queryKey: [
      ...payoutQueryKeys.all,
      'withdrawable',
      affiliateId,
      { startDate, endDate, selectedIds },
    ],
    queryFn: () => {
      return getWithdrawableAmountByDate(
        affiliateId,
        startDate,
        endDate,
        selectedIds,
      )
    },
    enabled:
      !!affiliateId &&
      ((!!startDate && !!endDate) || (!!selectedIds && selectedIds.length > 0)),
  })
}

const useAffiliatePayouts = (affiliateId: string) => {
  return useQuery({
    queryKey: payoutQueryKeys.history(affiliateId),
    queryFn: () => {
      return getAffiliatePayouts(affiliateId)
    },
    enabled: !!affiliateId,
  })
}

const useAffiliateSummary = (affiliateId?: string) => {
  const { data, isLoading } = usePendingPayouts({ affiliateId })

  const stats = useMemo(() => {
    return {
      pendingAmount: calculateCommissionByStatus(data, PayoutStatus.PENDING),
      withdrawableAmount: calculateCommissionByStatus(
        data,
        PayoutStatus.COMPLETED,
      ),
      paidAmount: calculateCommissionByStatus(data, PayoutStatus.PAID),
    }
  }, [data])

  return {
    ...stats,
    isLoading,
  }
}

export {
  usePendingPayouts,
  useAffiliateCommissions,
  useWithdrawableAmount,
  useAffiliatePayouts,
  useAffiliateSummary,
}
