import type { FC, PropsWithChildren } from 'react'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#f1f1f1]'>
      {children}
    </div>
  )
}

export default AuthLayout
