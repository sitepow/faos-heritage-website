import { Suspense } from 'react'

import { AccountLayout } from './_components/layout'

const Account = () => {
  return (
    <Suspense>
      <AccountLayout />
    </Suspense>
  )
}

export default Account
