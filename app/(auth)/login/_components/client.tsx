'use client'

import { useTheme } from 'next-themes'
import { Suspense, type FC, type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

const LoginClient: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useTheme()

  return (
    <Suspense>
      <div className='flex justify-center p-5 sm:p-10 light:bg-[#f1f1f1]'>
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

export { LoginClient }
