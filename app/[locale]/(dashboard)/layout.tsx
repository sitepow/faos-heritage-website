import { Role } from '@prisma/client'

import type { PropsWithChildren } from 'react'

export const metadata = disableSeoConfig

import { DashboardClient } from './client'

import { disableSeoConfig } from '@/config/site'
import { requireRole } from '@/lib/auth'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  await requireRole(Role.ADMIN)

  return <DashboardClient>{children}</DashboardClient>
}
