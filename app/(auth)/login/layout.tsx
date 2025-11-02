import { Suspense, type FC, type PropsWithChildren } from 'react'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Suspense>
      <div className='light:bg-[#f1f1f1] flex min-h-screen items-center justify-center'>
        {children}
      </div>
    </Suspense>
  )
}

export default AuthLayout
