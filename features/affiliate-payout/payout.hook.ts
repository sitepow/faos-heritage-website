'use client'

import { useQuery } from '@tanstack/react-query'

import { getPendingPayouts } from './payout.action'
import { payoutQueryKeys } from './payout.query-key'

interface UsePendingPayoutsParams {
  startDate?: string
  endDate?: string
}

const usePendingPayouts = ({ startDate, endDate }: UsePendingPayoutsParams) => {
  return useQuery({
    queryKey: payoutQueryKeys.pending(startDate, endDate),
    queryFn: () => {
      return getPendingPayouts(startDate, endDate)
    },
  })
}

export { usePendingPayouts }
