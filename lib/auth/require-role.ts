import { redirect } from 'next/navigation'

import type { Role } from '@prisma/client'

import { requireSession } from './require-session'

const requireRole = async (role: Role) => {
  const session = await requireSession()

  if (session?.user?.role !== role) {
    redirect('/')
  }

  return session
}

const requireRoles = async (roles: Role[]) => {
  const session = await requireSession()

  if (!roles.includes(session?.user?.role as Role)) {
    redirect('/')
  }

  return session
}

export { requireRole, requireRoles }
