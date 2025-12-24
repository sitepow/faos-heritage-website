'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/utils/style'

interface ThemeSwitchProps {
  className?: string
}

export const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isLight = (resolvedTheme ?? theme) === 'light'

  const toggleTheme = () => {
    setTheme(isLight ? 'dark' : 'light')
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center',
        'rounded-lg p-2',
        'text-default-400 hover:text-default-900',
        'transition-colors',
        className,
      )}
    >
      {isLight ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
