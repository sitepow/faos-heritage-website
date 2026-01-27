'use client'

import { SessionProvider } from 'next-auth/react'

import type { PropsWithChildren } from 'react'

const NextAuthProviders = ({ children }: PropsWithChildren) => {
  return <SessionProvider>{children}</SessionProvider>
}

export { NextAuthProviders }
