import { Role } from '@prisma/client'

import type { PropsWithChildren } from 'react'

import { AdminNavbar } from '../../../components/layouts/Navbar/AdminNavbar'

import { AppMain } from '@/components/layouts/AppMain'
import { DISABLE_SEO_CONFIG } from '@/constants/app'
import { requireRole } from '@/utils/auth'

export const metadata = DISABLE_SEO_CONFIG

export default async function DashboardLayout({ children }: PropsWithChildren) {
  await requireRole(Role.ADMIN)

  return (
    <>
      <AdminNavbar />
      <AppMain>{children}</AppMain>
    </>
  )
}
