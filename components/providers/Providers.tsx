'use client'

import { useTheme } from 'next-themes'
import { Suspense, type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

import { HeroUIProviders } from './HeroUI'
import { NextAuthProviders } from './NextAuth'
import { QueryProviders } from './QueryClient'

const Providers = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()

  return (
    <Suspense>
      <QueryProviders>
        <NextAuthProviders>
          <HeroUIProviders
            themeProps={{
              attribute: 'class',
              defaultTheme: 'system',
              enableSystem: true,
            }}
          >
            <ToastContainer
              closeOnClick
              hideProgressBar
              stacked
              autoClose={3000}
              closeButton={false}
              theme={theme === 'dark' ? 'dark' : 'light'}
            />

            {children}
          </HeroUIProviders>
        </NextAuthProviders>
      </QueryProviders>
    </Suspense>
  )
}

export { Providers }
