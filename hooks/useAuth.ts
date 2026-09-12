import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

const useAuth = () => {
  const { data: session, status } = useSession()

  const user = session?.user
  const userId = user?.id
  const roles: Role[] = useMemo(() => user?.roles || [], [user?.roles])

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  const isAdmin = roles.includes(Role.ADMIN)
  const isStockViewer = roles.includes(Role.STOCK_VIEWER)
  const isStockEditor = roles.includes(Role.STOCK_EDITOR)
  const isPOS = roles.includes(Role.POS)

  const isStockManager = isStockViewer || isStockEditor
  const canManageStock = isAdmin || isStockManager

  return useMemo(
    () => ({
      userId,
      user,
      roles,
      isAuthenticated,
      isLoading,
      isAdmin,
      isStockManager,
      isStockViewer,
      isStockEditor,
      isPOS,
      canManageStock,
      session,
    }),
    [
      userId,
      user,
      roles,
      isAuthenticated,
      isLoading,
      isAdmin,
      isStockManager,
      isStockViewer,
      isStockEditor,
      isPOS,
      canManageStock,
      session,
    ],
  )
}

export { useAuth }
