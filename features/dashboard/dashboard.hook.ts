import { useQuery } from '@tanstack/react-query'

import {
  getRevenueChartData,
  getOrderStatusData,
  getSalesByCategoryData,
  getTopProductsData,
} from './dashboard.action'
import { dashboardQueryKeys } from './dashboard.query-key'

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

  return {
    revenueData: revenueQuery.data || [],
    statusData: statusQuery.data || [],
    salesByCategoryData: salesByCategoryQuery.data || [],
    topProductsData: topProductsQuery.data || [],
    isLoading:
      revenueQuery.isLoading ||
      statusQuery.isLoading ||
      salesByCategoryQuery.isLoading ||
      topProductsQuery.isLoading,
  }
}

export { useDashboardCharts }
