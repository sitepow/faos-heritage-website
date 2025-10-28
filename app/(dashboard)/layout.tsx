import type { FC, PropsWithChildren } from 'react'

import { AdminNavbar } from '@/components/navbar/admin-navbar'

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden bg-[#f1f1f1]'>
      <AdminNavbar />
      <main className='container mx-auto flex-grow p-6'>{children}</main>
    </div>
  )
}

export default DashboardLayout
