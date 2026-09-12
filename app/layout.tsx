import '@/styles/globals.css'

import localFont from 'next/font/local'

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

const pgHomeplace = localFont({
  src: [
    {
      path: './fonts/PG Homeplace Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: './fonts/PG Homeplace.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/PG Homeplace Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pg-homeplace',
  display: 'swap',
  declarations: [{ prop: 'size-adjust', value: '140%' }],
})

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html suppressHydrationWarning className={pgHomeplace.variable}>
      <body
        className={cn(
          'text-foreground bg-background relative flex h-dvh min-h-screen flex-col antialiased',
          pgHomeplace.className,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
