const payoutQueryKeys = {
  all: ['payouts'] as const,
  pending: (startDate?: string, endDate?: string) => {
    return [...payoutQueryKeys.all, 'pending', { startDate, endDate }] as const
  },
  commissions: (affiliateId: string) => {
    return [...payoutQueryKeys.all, 'commissions', affiliateId] as const
  },
  history: (affiliateId: string) => {
    return [...payoutQueryKeys.all, 'history', affiliateId] as const
  },
}

export { payoutQueryKeys }
