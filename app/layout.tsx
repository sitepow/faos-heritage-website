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
  weight: ['400', '500', '600', '700'],
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
        className={`text-foreground min-h-screen bg-[#f1f1f1] font-sans antialiased dark:bg-[#131314] ${anuphan.className}`}
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
