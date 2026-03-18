'use client'

import { useQuery } from '@tanstack/react-query'

import { getUser, getUsers, getUserStat } from './action'
import { userQueryKeys } from './query-key'

const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: userQueryKeys.lists.filtered({ page, limit }),
    queryFn: () => getUsers(page, limit),
    placeholderData: (previousData) => previousData,
  })
}

const useUser = (userId: string | null) => {
  return useQuery({
    queryKey: userQueryKeys.details.byId(userId || ''),
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  })
}

const useUserStat = () => {
  return useQuery({
    queryKey: userQueryKeys.stats(),
    queryFn: () => getUserStat(),
  })
}

export { useUsers, useUser, useUserStat }
