import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

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
import { authOptions } from '../api/auth/[...nextauth]/route'

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) redirect('/login')
  if (session.user.role !== Role.ADMIN) redirect('/')

  return <DashboardLayout>{children}</DashboardLayout>
}

export default Layout
