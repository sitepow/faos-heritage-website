import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { Suspense } from 'react'

import { AccountLayout } from './_components/layout'

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route'

const Account = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS)

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
