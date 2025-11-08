import { Suspense, type FC, type PropsWithChildren } from 'react'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Suspense>
      <div className='flex min-h-screen items-center justify-center light:bg-[#f1f1f1]'>
        {children}
      </div>
    </Suspense>
  )
}

export default AuthLayout
