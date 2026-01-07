'use client'

import { useTheme } from 'next-themes'
import { ToastContainer } from 'react-toastify'

import type { PropsWithChildren } from 'react'

import { Footer } from '@/components/layout/footer'
import { Country } from '@/components/layout/navbar/country'
import { Navbar } from '@/components/layout/navbar/navbar'

export default function MainLayout({ children }: PropsWithChildren) {
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

        <div className='mx-auto flex max-w-[1920px] flex-col gap-5'>
          <div className='flex w-full justify-center xl:hidden'>
            <Country />
          </div>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}
