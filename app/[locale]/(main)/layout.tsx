'use client'

import { useTheme } from 'next-themes'
import { ToastContainer } from 'react-toastify'

import type { PropsWithChildren } from 'react'

import { Navbar } from '@/components/Navbar/Navbar'
import { Footer } from '@/components/layouts/Footer/Footer'

export default function MainLayout({ children }: PropsWithChildren) {
  const { theme } = useTheme()

  return (
    <div className='relative flex h-dvh flex-col overflow-x-hidden'>
      <ToastContainer
        closeOnClick
        hideProgressBar
        stacked
        autoClose={3000}
        closeButton={false}
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
      <Navbar />
      <main className='mx-auto flex w-full flex-grow flex-col gap-5'>
        {children}
      </main>
      <Footer />
    </div>
  )
}
