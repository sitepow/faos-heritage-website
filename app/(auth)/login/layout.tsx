import type { FC, PropsWithChildren } from 'react'

import LoginLayout from './components/layout'

export const metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
  },
}

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <LoginLayout>{children}</LoginLayout>
}

export default Layout
