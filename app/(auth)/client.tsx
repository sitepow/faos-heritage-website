'use client'

import { useTheme } from 'next-themes'
import { Suspense, type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

export const AuthClient = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()

  return (
    <Suspense>
      <div className='light:bg-[#f1f1f1] flex justify-center p-5 sm:p-10'>
        <ToastContainer
          closeOnClick
          hideProgressBar
          stacked
          autoClose={3000}
          closeButton={false}
          theme={theme === 'dark' ? 'dark' : 'light'}
        />

        {children}
      </div>
    </Suspense>
  )
}
