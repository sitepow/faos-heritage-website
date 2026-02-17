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

const HeroUIProviders = ({ children, themeProps }: HeroUIProvidersProps) => {
  const router = useRouter()

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps} enableSystem defaultTheme='dark'>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}

export { HeroUIProviders }
