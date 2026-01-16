import type { PropsWithChildren } from 'react'

import { AuthClient } from './client'

import { disableSeoConfig } from '@/config/site'

export const metadata = disableSeoConfig

export default function AuthLayout({ children }: PropsWithChildren) {
  return <AuthClient>{children}</AuthClient>
}
