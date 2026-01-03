'use client'

import { useTheme } from 'next-themes'
import { ToastContainer } from 'react-toastify'

import type { PropsWithChildren } from 'react'

// import { PurchaseAlert } from '@/components/features/alert/purchase'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar/navbar'

export default function MainLayout({ children }: PropsWithChildren) {
  const { theme } = useTheme()

  return (
    <div className='relative flex h-screen flex-col overflow-x-hidden'>
      <Navbar />
      <main className='container mx-auto flex-grow p-6'>
        {/* <PurchaseAlert /> */}
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
