'use client'

import { useTheme } from 'next-themes'
import { Suspense, type FC, type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme()

  return (
    <Suspense>
      <div className='flex min-h-screen items-center justify-center light:bg-[#f1f1f1]'>
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

export default AuthLayout
