'use client'

import { useTheme } from 'next-themes'
import { type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

import { Footer, Navbar } from '@/components/layout'

export const DashboardClient = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()

  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden'>
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
