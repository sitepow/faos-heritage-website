const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  revenue: () => [...dashboardQueryKeys.all, 'revenue-chart'] as const,
  orderStatus: () => [...dashboardQueryKeys.all, 'status-chart'] as const,
}

export { dashboardQueryKeys }
