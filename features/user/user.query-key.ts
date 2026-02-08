import type { Role } from '@prisma/client'

type UserListFilters = {
  isActive?: boolean
  role?: Role
  search?: string
  page?: number
  limit?: number
}

const userQueryKeys = {
  all: ['users'] as const,

  lists: {
    all: () => [...userQueryKeys.all, 'list'] as const,

    filtered: (filters: UserListFilters) =>
      [...userQueryKeys.lists.all(), filters] as const,
  },

  details: {
    all: () => [...userQueryKeys.all, 'detail'] as const,

    me: () => [...userQueryKeys.details.all(), 'me'] as const,

    byId: (id: string) => [...userQueryKeys.details.all(), id] as const,
  },

  stats: () => [...userQueryKeys.all, 'stats'] as const,
}

export { userQueryKeys }
export type { UserListFilters }
