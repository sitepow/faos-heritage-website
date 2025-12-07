'use client'

import { HeroUIProvider } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

import type { ThemeProviderProps } from 'next-themes'
import type { FC, ReactNode } from 'react'

export interface Props {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >
  }
}

const HeroUIProviders: FC<Props> = ({ children, themeProps }) => {
  const router = useRouter()

  return (
    <HeroUIProvider
      disableAnimation
      disableRipple
      skipFramerMotionAnimations
      navigate={router.push}
    >
      <NextThemesProvider {...themeProps} defaultTheme='light'>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}

export { HeroUIProviders }
