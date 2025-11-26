import type { FC, PropsWithChildren } from 'react'

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
}

import { DashboardLayout } from './_components/layout'

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>
}

export default Layout
