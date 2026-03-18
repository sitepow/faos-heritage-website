'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getAffiliateById,
  getAffiliateDashboardData,
  getAffiliateProfile,
  getAffiliates,
} from './action'
import { affiliateQueryKeys } from './query-key'

interface CommissionChartItem {
  date: string
  commission: number
}

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

const useAffiliateById = (id: string) => {
  return useQuery({
    queryKey: affiliateQueryKeys.detail(id),
    queryFn: () => {
      return getAffiliateById(id)
    },
    enabled: !!id,
  })
}

const useAffiliateDashboard = () => {
  const query = useQuery({
    queryKey: affiliateQueryKeys.dashboard(),
    queryFn: async () => {
      return getAffiliateDashboardData()
    },
  })

  const chartData = query.data?.recentCommissions
    .reduce((acc: CommissionChartItem[], curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
      })

      const existing = acc.find((item) => {
        return item.date === date
      })

      if (existing) {
        existing.commission += Number(curr.commissionAmount)
      } else {
        acc.push({ date, commission: Number(curr.commissionAmount) })
      }
      return acc
    }, [])
    .reverse()

  return {
    ...query,
    chartData: chartData || [],
  }
}

export {
  useAffiliates,
  useAffiliateProfile,
  useAffiliateDashboard,
  useAffiliateById,
}
