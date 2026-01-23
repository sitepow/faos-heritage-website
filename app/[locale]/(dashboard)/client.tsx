'use client'

import { useTheme } from 'next-themes'
import { type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

import { AdminNavbar } from './_components/navbar'

export const DashboardClient = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()

  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden'>
      <ToastContainer
        closeOnClick
        hideProgressBar
        stacked
        autoClose={3000}
        closeButton={false}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      <AdminNavbar />
      <main className='container mx-auto flex flex-grow flex-col gap-5 p-6'>
        {children}
      </main>
    </div>
  )
}
