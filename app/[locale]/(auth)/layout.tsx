import type { PropsWithChildren } from 'react'

import { AppMain } from '@/components/layouts/AppMain'
import { DISABLE_SEO_CONFIG } from '@/constants'
import { redirectIfAuthenticated } from '@/utils/auth'

export const metadata = DISABLE_SEO_CONFIG

const AuthLayout = async ({ children }: PropsWithChildren) => {
  await redirectIfAuthenticated('/')

  return <AppMain className='overflow-hidden'>{children}</AppMain>
}

export default AuthLayout
