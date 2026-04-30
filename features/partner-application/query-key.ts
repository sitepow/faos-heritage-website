import type { ApplicationStatus } from '@prisma/client'

export type PartnerListFilters = {
  status?: ApplicationStatus
  businessType?: string
  limit?: number
  page?: number
}

const partnerQueryKeys = {
  all: ['partner-applications'] as const,
  lists: {
    all: () => [...partnerQueryKeys.all, 'list'] as const,
    mine: () => [...partnerQueryKeys.all, 'list', 'mine'] as const,
    filtered: (filters: PartnerListFilters) =>
      [...partnerQueryKeys.lists.all(), filters] as const,
  },
  details: {
    all: () => [...partnerQueryKeys.all, 'detail'] as const,
    byId: (id: string) => [...partnerQueryKeys.details.all(), id] as const,
  },
  subscription: {
    all: () => [...partnerQueryKeys.all, 'subscription'] as const,
    current: () => [...partnerQueryKeys.subscription.all(), 'current'] as const,
  },
}

export { partnerQueryKeys }
