import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'

const useAuth = () => {
  const { data: session, status } = useSession()

  const userId = session?.user?.id
  const user = session?.user
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  const roles = user?.roles || []

  const isAdmin = roles.includes(Role.ADMIN)

  const isStockManager = roles.includes(Role.STOCK_MANAGER)

  const isPOS = roles.includes(Role.POS)

  const canManageStock = roles.some((role: Role) => {
    return role === Role.ADMIN || role === Role.STOCK_MANAGER
  })

  return {
    userId,
    user,
    roles,
    isAuthenticated,
    isLoading,
    isAdmin,
    isStockManager,
    isPOS,
    canManageStock,
    session,
  }
}

export { useAuth }
