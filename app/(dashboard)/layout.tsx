import { Role } from '@prisma/client'

import type { PropsWithChildren } from 'react'

import { AppMain } from '@/components/layouts/AppMain'
import { AdminSidebar } from '@/components/ui/AdminSidebar'
import { constructMetadata } from '@/lib/metadata'
import { requireAnyRole } from '@/utils'

const generateMetadata = async () => {
  return await constructMetadata({
    title: 'แผงควบคุมผู้ดูแลระบบ',
    canonicalPath: '/admin',
    noIndex: true,
  })
}

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  await requireAnyRole([Role.ADMIN, Role.STOCK_MANAGER, Role.POS] as const)

  return (
    <div className='bg-background relative flex min-h-screen flex-col lg:flex-row'>
      <AdminSidebar />

      <div className='flex min-w-0 flex-1 flex-col'>
        <AppMain>
          <div className='p-2 md:px-8 md:py-6'>{children}</div>
        </AppMain>
      </div>
    </div>
  )
}

export { generateMetadata }
export default DashboardLayout
