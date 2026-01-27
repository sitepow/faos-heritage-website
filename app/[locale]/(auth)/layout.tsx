import type { PropsWithChildren } from 'react'

import { AuthClient } from './client'

import { DISABLE_SEO_CONFIG } from '@/constants/app'

export const metadata = DISABLE_SEO_CONFIG

export default function AuthLayout({ children }: PropsWithChildren) {
  return <AuthClient>{children}</AuthClient>
}
