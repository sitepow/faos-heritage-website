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
    <div className='bg-background relative flex min-h-screen flex-col lg:flex-row'>
      <AdminSidebar />

      <div className='flex flex-1 flex-col'>
        <AppMain>
          <div className='p-2 md:px-8 md:py-6'>{children}</div>
        </AppMain>
      </div>
    </div>
  )
}

export { generateMetadata }
export default DashboardLayout
