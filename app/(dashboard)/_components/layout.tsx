'use client'

import { useTheme } from 'next-themes'
import { ToastContainer } from 'react-toastify'

import type { FC, PropsWithChildren } from 'react'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme()

  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden light:bg-[#f1f1f1]'>
      <Navbar />
      <main className='container mx-auto flex-grow p-6'>
        <ToastContainer
          closeOnClick
          hideProgressBar
          stacked
          autoClose={3000}
          closeButton={false}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
        {children}
      </main>
      <Footer />
    </div>
  )
}

export { DashboardLayout }
