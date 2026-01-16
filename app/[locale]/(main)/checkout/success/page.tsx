'use client'

import { Suspense } from 'react'

import { SuccessClient } from '@/app/[locale]/(main)/checkout/success/client'

export default function Success() {
  return (
    <Suspense>
      <SuccessClient />
    </Suspense>
  )
}
