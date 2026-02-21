import { useQuery } from '@tanstack/react-query'

import { getFavorites } from './favorite.action'
import { favoriteQueryKeys } from './favorite.query-key'

import { useAuth } from '@/hooks/useAuth'

interface Params {
  limit?: number
  locale?: string
}

const useFavorites = ({ limit, locale }: Params = {}) => {
  const { userId } = useAuth()

  const query = useQuery({
    queryKey: [...favoriteQueryKeys.lists.byUserId(userId!), { locale, limit }],
    queryFn: () => getFavorites({ userId, limit, locale }),
    enabled: !!userId,
  })

  const favorites = query.data?.items ?? []
  const isEmpty = !query.isLoading && favorites.length === 0

  return {
    ...query,
    favorites,
    totalCount: query.data?.totalCount ?? 0,
    isEmpty,
  }
}

export { useFavorites }
