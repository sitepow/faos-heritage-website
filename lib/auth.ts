import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import type { Role } from '@prisma/client'

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route'

export const getSession = async () => {
  return await getServerSession(NEXT_AUTH_OPTIONS)
}

export const requireSession = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS)

  if (!session?.user) {
    redirect('/login')
  }

  return session
}

export const requireRole = async (role: Role) => {
  const session = await requireSession()

  if (session?.user?.role !== role) {
    redirect('/')
  }

  return session
}

export const requireRoles = async (roles: Role[]) => {
  const session = await requireSession()

  if (!roles.includes(session?.user?.role as Role)) {
    redirect('/')
  }

  return session
}
