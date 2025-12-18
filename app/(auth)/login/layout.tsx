import type { FC, PropsWithChildren } from 'react'

import { LoginClient } from './_components/client'

import { disableSeoConfig } from '@/config/site'

export const metadata = disableSeoConfig

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <LoginClient>{children}</LoginClient>
}

export default Layout
