import { redirect } from 'next/navigation'

import type { PropsWithChildren } from 'react'

import { AppMain } from '@/components/layouts/AppMain'
import { DISABLE_SEO_CONFIG } from '@/constants'
import { getAuthSession } from '@/utils/auth'

export const metadata = DISABLE_SEO_CONFIG

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await getAuthSession()

  if (session?.user) {
    redirect('/')
  }

  return <AppMain>{children}</AppMain>
}
