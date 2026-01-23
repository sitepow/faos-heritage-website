'use client'

import { Alert } from '@heroui/react'

import type { PropsWithChildren } from 'react'

export const PageNotFound = ({ children }: PropsWithChildren) => {
  return (
    <div className='container mx-auto flex h-full items-center justify-center'>
      <Alert description={children} color='warning' variant='faded' />
    </div>
  )
}
