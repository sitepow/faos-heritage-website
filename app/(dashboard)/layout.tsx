import { ToastContainer } from 'react-toastify'

import type { FC, PropsWithChildren } from 'react'

import { Footer } from '@/components/footer'
import { AdminNavbar } from '@/components/navbar/admin'

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden light:bg-[#f1f1f1]'>
      <AdminNavbar />
      <main className='container mx-auto flex-grow p-6'>
        <ToastContainer hideProgressBar stacked />
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default DashboardLayout
