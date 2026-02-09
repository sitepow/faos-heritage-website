import { useQuery } from '@tanstack/react-query'

import { getUser } from './user.action'
import { userQueryKeys } from './user.query-key'

const useUser = (userId: string) => {
  return useQuery({
    queryKey: userQueryKeys.details.byId(userId!),
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  })
}

export { useUser }
