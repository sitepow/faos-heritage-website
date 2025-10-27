import '@/styles/globals.css'
import clsx from 'clsx'

import type { Metadata, Viewport } from 'next'
import type { FC, PropsWithChildren } from 'react'

import { HeroUIProviders } from '../providers/heroui'

import { fontSans } from '@/config/fonts'
import { siteConfig } from '@/config/site'
import { NextAuthProviders } from '@/providers/nextauth'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html suppressHydrationWarning lang='en'>
      <head />
      <body
        className={clsx(
          'text-foreground bg-background min-h-screen font-sans antialiased',
          fontSans.variable,
        )}
      >
        <NextAuthProviders>
          <HeroUIProviders
            themeProps={{ attribute: 'class', defaultTheme: 'dark' }}
          >
            {children}
          </HeroUIProviders>
        </NextAuthProviders>
      </body>
    </html>
  )
}

export default RootLayout
