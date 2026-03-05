'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getPendingPayouts,
  getAffiliateCommissions,
  getWithdrawableAmountByDate,
  getAffiliatePayouts,
} from './payout.action'
import { payoutQueryKeys } from './payout.query-key'

interface UsePendingPayoutsParams {
  startDate?: string
  endDate?: string
}

interface UseWithdrawableParams {
  affiliateId: string
  startDate?: string
  endDate?: string
  selectedIds?: string[]
}

const usePendingPayouts = ({ startDate, endDate }: UsePendingPayoutsParams) => {
  return useQuery({
    queryKey: payoutQueryKeys.pending(startDate, endDate),
    queryFn: () => {
      return getPendingPayouts(startDate, endDate)
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

export {
  usePendingPayouts,
  useAffiliateCommissions,
  useWithdrawableAmount,
  useAffiliatePayouts,
}
