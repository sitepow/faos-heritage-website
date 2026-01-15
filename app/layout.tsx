import '@/styles/globals.css'

// import { Sarabun } from 'next/font/google'
import { Anuphan } from 'next/font/google'

import type { Viewport } from 'next'
import type { PropsWithChildren } from 'react'

import { HeroUIProviders } from '../providers/heroui'

// import { fontSukhumvit } from '@/config/fonts'
import { NextAuthProviders } from '@/providers/nextauth'
import { QueryProviders } from '@/providers/query'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

// const sarabun = Sarabun({
//   subsets: ['latin'],
//   weight: ['400', '700'],
// })

const anuphan = Anuphan({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body
        // className={cn(
        //   'bg-background text-foreground min-h-screen font-sans antialiased',
        //   fontSukhumvit.variable,
        // )}
        className={`bg-background text-foreground min-h-screen font-sans antialiased ${anuphan.className}`}
      >
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
      </body>
    </html>
  )
}
