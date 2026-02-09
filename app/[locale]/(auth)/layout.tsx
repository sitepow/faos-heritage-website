import type { PropsWithChildren } from 'react'

import { DISABLE_SEO_CONFIG } from '@/constants'
import { redirectIfAuthenticated } from '@/utils/auth'

export const metadata = DISABLE_SEO_CONFIG

const AuthLayout = async ({ children }: PropsWithChildren) => {
  await redirectIfAuthenticated('/')

  return <div className='overflow-hidden'>{children}</div>
}

export default AuthLayout
