import { Role } from '@prisma/client'

import type { FC, PropsWithChildren } from 'react'

export const metadata = disableSeoConfig

import { DashboardClient } from './_components/client'

import { disableSeoConfig } from '@/config/site'
import { requireRole } from '@/lib/auth/require-role'

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  await requireRole(Role.ADMIN)

  return <DashboardClient>{children}</DashboardClient>
}

export default Layout
