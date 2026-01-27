import { Suspense } from 'react'

import { AccountClient } from './client'

import { requireSession } from '@/utils/auth'

export default async function Account() {
  await requireSession()

  return (
    <Suspense>
      <AccountClient />
    </Suspense>
  )
}
