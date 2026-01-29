import { Role } from '@prisma/client'

import type { PropsWithChildren } from 'react'

import { AppMain } from '@/components/layouts/AppMain'
import { DISABLE_SEO_CONFIG } from '@/constants/app'
import { requireRole } from '@/utils/auth'

export const metadata = DISABLE_SEO_CONFIG

export default async function DashboardLayout({ children }: PropsWithChildren) {
  await requireRole(Role.ADMIN)

  return (
    <>
      <AppMain>{children}</AppMain>
    </>
  )
}
