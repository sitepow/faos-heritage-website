import '@/styles/globals.css'

import type { Viewport } from 'next'
import type { PropsWithChildren } from 'react'

import { Providers } from '@/components/providers/Providers'
import { BRAND_COLORS } from '@/constants'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.primary },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.primary },
  ],
}

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html suppressHydrationWarning>
      <body className='text-foreground relative flex h-dvh min-h-screen flex-col antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
