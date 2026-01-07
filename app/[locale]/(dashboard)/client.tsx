'use client'

import { useTheme } from 'next-themes'
import { type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

import { Footer, Navbar } from '@/components/layout'

export const DashboardClient = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()

  return (
    <div className='bg-background relative flex h-screen flex-col overflow-x-hidden'>
      <Navbar />
      <main className='w-full flex-grow px-4 py-6 md:px-8 lg:px-12'>
        <ToastContainer
          closeOnClick
          hideProgressBar
          stacked
          autoClose={3000}
          closeButton={false}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />

        <div className='mx-auto max-w-[1920px]'>{children}</div>
      </main>
      <Footer />
    </div>
  )
}
