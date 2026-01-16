'use client'

import { useTheme } from 'next-themes'
import { type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar/navbar'

export const DashboardClient = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()

  return (
    <div className='dark:bg-default-50 relative flex h-screen flex-col overflow-x-hidden'>
      <ToastContainer
        closeOnClick
        hideProgressBar
        stacked
        autoClose={3000}
        closeButton={false}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      <Navbar />
      <main className='container mx-auto flex flex-grow flex-col gap-5 p-6'>
        {children}
      </main>
      <Footer />
    </div>
  )
}
