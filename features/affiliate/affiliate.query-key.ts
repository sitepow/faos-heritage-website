const affiliateQueryKeys = {
  all: ['affiliates'] as const,
  lists: () => {
    return [...affiliateQueryKeys.all, 'list'] as const
  },
  detail: (id: string) => {
    return [...affiliateQueryKeys.all, 'detail', id] as const
  },
  profile: () => {
    return [...affiliateQueryKeys.all, 'profile'] as const
  },
  dashboard: () => {
    return [...affiliateQueryKeys.all, 'dashboard'] as const
  },
}

export { affiliateQueryKeys }
