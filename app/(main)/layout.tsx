import { ToastContainer } from 'react-toastify'

import type { FC, PropsWithChildren } from 'react'

import { Footer } from '@/components/footer'
import { MainNavbar } from '@/components/navbar'

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden light:bg-[#f1f1f1]'>
      <MainNavbar />
      <main className='container mx-auto flex-grow p-6'>
        <ToastContainer hideProgressBar stacked />
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
