import '@/styles/globals.css'

import type { Viewport } from 'next'
import type { PropsWithChildren } from 'react'

import { HeroUIProviders } from '../providers/heroui'

import { fontSukhumvit } from '@/config/fonts'
import { NextAuthProviders } from '@/providers/nextauth'
import { QueryProviders } from '@/providers/query'
import { cn } from '@/utils/style'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'bg-background text-foreground min-h-screen font-sans antialiased',
          fontSukhumvit.variable,
        )}
      >
        <QueryProviders>
          <NextAuthProviders>
            <HeroUIProviders
              themeProps={{ attribute: 'class', defaultTheme: 'dark' }}
            >
              {children}
            </HeroUIProviders>
          </NextAuthProviders>
        </QueryProviders>
      </body>
    </html>
  )
}
