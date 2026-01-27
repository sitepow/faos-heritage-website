'use client'

import type { PropsWithChildren } from 'react'

import { QueryProviders } from './QueryClient'
import { HeroUIProviders } from './heroui'
import { NextAuthProviders } from './nextauth'

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryProviders>
      <NextAuthProviders>
        <HeroUIProviders
          themeProps={{
            attribute: 'class',
            defaultTheme: 'system',
            enableSystem: true,
          }}
        >
          {children}
        </HeroUIProviders>
      </NextAuthProviders>
    </QueryProviders>
  )
}

export { Providers }
