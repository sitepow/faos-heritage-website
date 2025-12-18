import { Suspense } from 'react'

import { AccountClient } from '@/app/(main)/account/_components/client/account'
import { requireSession } from '@/lib/auth/require-session'

const Account = async () => {
  await requireSession()

  return (
    <Suspense>
      <AccountClient />
    </Suspense>
  )
}

export default Account
