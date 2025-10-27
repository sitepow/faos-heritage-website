import type { FC, PropsWithChildren } from 'react'

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      {children}
    </div>
  )
}

export default AuthLayout
