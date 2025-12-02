'use client'

import { useTheme } from 'next-themes'
import { ToastContainer } from 'react-toastify'

import { useEffect, type FC, type PropsWithChildren } from 'react'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme()
  const router = useRouter()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === Role.ADMIN

  useEffect(() => {
    if (session && !isAdmin) {
      router.push('/')
    }
  }, [isAdmin, router, session])

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
