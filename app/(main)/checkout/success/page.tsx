'use client'

import { Suspense } from 'react'

import { SuccessClient } from '@/app/(main)/checkout/_components/client/success'

const Success = () => {
  return (
    <Suspense>
      <SuccessClient />
    </Suspense>
  )
}

export default Success
