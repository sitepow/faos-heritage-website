import '@/styles/globals.css'

import { Anuphan } from 'next/font/google'

import type { Viewport } from 'next'
import type { PropsWithChildren } from 'react'

import { Providers } from '@/components/providers/Providers'
import { BRAND_COLORS } from '@/constants/app'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.primary },
    { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.primary },
  ],
}

const anuphan = Anuphan({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-anuphan',
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html suppressHydrationWarning>
      <body
        className={[
          'text-foreground min-h-screen antialiased',
          'relative flex h-dvh flex-col',
          'font-sans',
          anuphan.variable,
        ].join(' ')}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
