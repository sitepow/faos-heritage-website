'use client'

import { Suspense } from 'react'

import { CancelClient } from '@/app/[locale]/(main)/checkout/cancel/client'

export default function Cancel() {
  return (
    <Suspense>
      <CancelClient />
    </Suspense>
  )
}
