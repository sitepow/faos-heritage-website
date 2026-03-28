import '@/styles/globals.css'

import { IBM_Plex_Sans_Thai } from 'next/font/google'

// import type { Viewport } from 'next'
import type { PropsWithChildren } from 'react'

import { Providers } from '@/components/providers/Providers'
// import { BRAND_COLORS } from '@/constants'
import { cn } from '@/utils'

// export const viewport: Viewport = {
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: BRAND_COLORS.primary },
//     { media: '(prefers-color-scheme: dark)', color: BRAND_COLORS.primary },
//   ],
// }

const anuphan = IBM_Plex_Sans_Thai({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-anuphan',
})

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html suppressHydrationWarning>
      <body
        className={cn(
          'text-foreground bg-background relative flex h-dvh min-h-screen flex-col antialiased',
          anuphan.className,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
