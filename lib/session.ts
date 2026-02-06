import { getServerSession } from 'next-auth/next'

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route'

const getServerUser = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS)

  return {
    userId: session?.user?.id,
    user: session?.user,
    isAuthenticated: !!session,
    session,
  }
}

export { getServerUser }
