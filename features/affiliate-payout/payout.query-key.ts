const payoutQueryKeys = {
  all: ['payouts'] as const,
  pending: (startDate?: string, endDate?: string) => {
    return [...payoutQueryKeys.all, 'pending', { startDate, endDate }] as const
  },
}

export { payoutQueryKeys }
