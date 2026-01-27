import { Role } from '@prisma/client'

import type { PropsWithChildren } from 'react'

export const metadata = DISABLE_SEO_CONFIG

import { DashboardClient } from './client'

import { DISABLE_SEO_CONFIG } from '@/constants/app'
import { requireRole } from '@/utils/auth'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  await requireRole(Role.ADMIN)

  return <DashboardClient>{children}</DashboardClient>
}
