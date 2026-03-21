import { useQuery } from '@tanstack/react-query'

import {
  getRevenueChartData,
  getOrderStatusData,
  getSalesByCategoryData,
  getTopProductsData,
  getAffiliateStats,
  getAffiliatePerformanceData,
  getInventoryValueData,
} from './action'
import { dashboardQueryKeys } from './query-key'

const useDashboardCharts = () => {
  const revenueQuery = useQuery({
    queryKey: dashboardQueryKeys.revenue(),
    queryFn: () => getRevenueChartData(),
  })

  const statusQuery = useQuery({
    queryKey: dashboardQueryKeys.orderStatus(),
    queryFn: () => getOrderStatusData(),
  })

  const salesByCategoryQuery = useQuery({
    queryKey: ['dashboard', 'sales-category'],
    queryFn: () => getSalesByCategoryData(),
  })

  const topProductsQuery = useQuery({
    queryKey: ['dashboard', 'top-products'],
    queryFn: () => getTopProductsData(),
  })

  const affiliateStatsQuery = useQuery({
    queryKey: dashboardQueryKeys.affiliateStats(),
    queryFn: () => getAffiliateStats(),
  })

  const affiliatePerformanceQuery = useQuery({
    queryKey: dashboardQueryKeys.affiliatePerformance(),
    queryFn: () => getAffiliatePerformanceData(),
  })

  const inventoryValueQuery = useQuery({
    queryKey: dashboardQueryKeys.inventoryValue(),
    queryFn: () => {
      return getInventoryValueData()
    },
  })

  return {
    revenueData: revenueQuery.data || [],
    statusData: statusQuery.data || [],
    salesByCategoryData: salesByCategoryQuery.data || [],
    topProductsData: topProductsQuery.data || [],
    affiliateStats: affiliateStatsQuery.data || [],
    affiliatePerformanceData: affiliatePerformanceQuery.data || [],
    inventoryValue: inventoryValueQuery.data || null,
    isLoading:
      revenueQuery.isLoading ||
      statusQuery.isLoading ||
      salesByCategoryQuery.isLoading ||
      topProductsQuery.isLoading ||
      affiliateStatsQuery.isLoading ||
      affiliatePerformanceQuery.isLoading ||
      inventoryValueQuery.isLoading,
  }
}

export { useDashboardCharts }
