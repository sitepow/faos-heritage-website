import '@/styles/globals.css'

import { IBM_Plex_Sans_Thai } from 'next/font/google'

import type { PropsWithChildren } from 'react'

import { Providers } from '@/components/providers/Providers'
import { cn } from '@/utils'

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ['100', '400', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-ibm-plex-sans-thai',
  display: 'swap',
})

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html suppressHydrationWarning className={ibmPlexSansThai.variable}>
      <body
        className={cn(
          'text-foreground bg-background relative flex h-dvh min-h-screen flex-col antialiased',
          ibmPlexSansThai.className,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
