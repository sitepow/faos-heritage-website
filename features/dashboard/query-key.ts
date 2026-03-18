const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  revenue: () => [...dashboardQueryKeys.all, 'revenue-chart'] as const,
  orderStatus: () => [...dashboardQueryKeys.all, 'status-chart'] as const,
  salesByCategory: () => [...dashboardQueryKeys.all, 'sales-category'] as const,
  topProducts: () => [...dashboardQueryKeys.all, 'top-products'] as const,
  affiliateStats: () => [...dashboardQueryKeys.all, 'affiliate-stats'] as const,
  affiliatePerformance: () =>
    [...dashboardQueryKeys.all, 'affiliate-performance'] as const,
  inventoryValue: () => [...dashboardQueryKeys.all, 'inventory-value'] as const,
}

export { dashboardQueryKeys }
