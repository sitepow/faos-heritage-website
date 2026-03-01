import { Role } from '@prisma/client'

import type { PropsWithChildren } from 'react'

import { AppMain } from '@/components/layouts/AppMain'
import { AdminSidebar } from '@/components/ui/AdminSidebar'
import { constructMetadata } from '@/lib/metadata'
import { requireRole } from '@/utils/auth'

const generateMetadata = async () => {
  return await constructMetadata({
    title: 'แผงควบคุมผู้ดูแลระบบ',
    canonicalPath: '/admin',
    noIndex: true,
  })
}

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  await requireRole(Role.ADMIN)

  return (
    <div className='bg-background relative flex min-h-screen'>
      <AdminSidebar />
      <AppMain>{children}</AppMain>
    </div>
  )
}

export { generateMetadata }
export default DashboardLayout
