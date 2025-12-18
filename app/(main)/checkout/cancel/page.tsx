'use client'

import { Suspense } from 'react'

import { CancelClient } from '@/app/(main)/checkout/_components/client/cancel'

const Cancel = () => {
  return (
    <Suspense>
      <CancelClient />
    </Suspense>
  )
}

export default Cancel
