import { useSession } from 'next-auth/react'

const useAuth = () => {
  const { data: session, status } = useSession()

  const userId = session?.user?.id
  const user = session?.user
  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  return {
    userId,
    user,
    isAuthenticated,
    isLoading,
    session,
  }
}

export { useAuth }
