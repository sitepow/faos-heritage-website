'use client'

import { HeroUIProvider } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import type { ThemeProviderProps } from 'next-themes'
import type { ReactNode } from 'react'

interface HeroUIProvidersProps {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

export const HeroUIProviders = ({
  children,
  themeProps,
}: HeroUIProvidersProps) => {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps} defaultTheme='light'>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}
