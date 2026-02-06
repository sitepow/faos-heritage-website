import { useSession } from 'next-auth/react'

const useUser = () => {
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

export { useUser }
