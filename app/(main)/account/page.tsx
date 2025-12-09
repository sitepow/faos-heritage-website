import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Suspense } from 'react'

import { AccountLayout } from './_components/layout'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const Account = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <Suspense>
      <AccountLayout />
    </Suspense>
  )
}

export default Account
