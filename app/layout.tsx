import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import type { FC, PropsWithChildren } from 'react'

import { HeroUIProviders } from '../providers/heroui'

import { fontSukhumvit } from '@/config/fonts'
import { siteConfig } from '@/config/site'
import { NextAuthProviders } from '@/providers/nextauth'
import { cn } from '@/utils/style'

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.title}`,
    template: `%s - ${siteConfig.name} - ${siteConfig.title}`,
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
        className={cn(
          'min-h-screen bg-background font-sans text-foreground antialiased',
          fontSukhumvit.variable,
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
