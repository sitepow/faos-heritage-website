import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { NEXT_AUTH_OPTIONS } from '@/app/api/auth/[...nextauth]/route'

const getSession = async () => {
  return await getServerSession(NEXT_AUTH_OPTIONS)
}

const requireSession = async () => {
  const session = await getServerSession(NEXT_AUTH_OPTIONS)

  if (!session?.user) {
    redirect('/login')
  }

  return session
}

export { requireSession, getSession }
