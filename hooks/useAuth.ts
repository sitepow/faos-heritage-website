import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'

const useAuth = () => {
  const { data: session, status } = useSession()

  const userId = session?.user?.id
  const user = session?.user
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  const isAdmin = user?.roles?.includes(Role.ADMIN) ?? false

  const isStockManager = user?.roles?.includes(Role.STOCK_MANAGER) ?? false

  const canManageStock =
    user?.roles?.some((role: Role) => {
      return role === Role.ADMIN || role === Role.STOCK_MANAGER
    }) ?? false

  return {
    userId,
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isStockManager,
    canManageStock,
    session,
  }
}

export { useAuth }
