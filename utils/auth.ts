import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import type { Role } from '@prisma/client'

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route'

const redirectIfAuthenticated = async (redirectTo: string = '/') => {
  const session = await getAuthSession()

  if (session?.user) {
    redirect(redirectTo)
  }
}

const getAuthSession = async () => {
  return getServerSession(NEXT_AUTH_OPTIONS)
}

const requireAuth = async () => {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect('/login')
  }

  return session
}

const requireRole = async (role: Role) => {
  const session = await requireAuth()

  if (session.user.role !== role) {
    redirect('/')
  }

  return session
}

const requireAnyRole = async (roles: readonly Role[]) => {
  const session = await requireAuth()

  if (!roles.includes(session.user.role as Role)) {
    redirect('/')
  }

  return session
}

const normalizeEmail = (email?: string | null) =>
  email?.trim().toLowerCase() ?? null

export {
  redirectIfAuthenticated,
  getAuthSession,
  requireAuth,
  requireRole,
  requireAnyRole,
  normalizeEmail,
}
