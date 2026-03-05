const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  revenue: () => [...dashboardQueryKeys.all, 'revenue-chart'] as const,
  orderStatus: () => [...dashboardQueryKeys.all, 'status-chart'] as const,
  affiliateStats: () => [...dashboardQueryKeys.all, 'affiliate-stats'] as const,
  affiliatePerformance: () =>
    [...dashboardQueryKeys.all, 'affiliate-performance'] as const,
}

export { dashboardQueryKeys }
