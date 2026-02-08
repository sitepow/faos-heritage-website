/* eslint-disable no-unused-vars */
import { getServerSession } from 'next-auth/next'

import { ERROR_CODES, fail } from './errors'

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route'
import { getAuthSession } from '@/utils'

interface AuthUser {
  id: string
  role: string
}

const getServerUser = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS)

  return {
    userId: session?.user?.id,
    user: session?.user,
    isAuthenticated: !!session,
    session,
  }
}

const withRole = async <T>(
  roles: string[],
  action: (userId: string) => Promise<T>,
) => {
  const session = await getAuthSession()

  if (!session?.user) {
    return fail(ERROR_CODES.UNAUTHORIZED)
  }

  if (!roles.includes(session.user.role)) {
    return fail(ERROR_CODES.FORBIDDEN)
  }

  return action(session.user.id)
}

const withAuth = async <T>(action: (user: AuthUser) => Promise<T>) => {
  const session = await getAuthSession()

  if (!session?.user) {
    return fail(ERROR_CODES.UNAUTHORIZED)
  }

  return action(session.user as AuthUser)
}

export { getServerUser, withRole, withAuth }
