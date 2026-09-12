'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useIsMounted } from '@/hooks/useIsMounted'
import { cn } from '@/utils'

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    return setTheme(isDark ? 'light' : 'dark')
  }

  if (!isMounted) {
    return (
      <div className='h-7 w-14 rounded-full bg-neutral-200 dark:bg-neutral-800' />
    )
  }

  return (
    <button
      aria-label='Toggle theme'
      className={cn(
        'relative flex h-7 w-14 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#ba8c25] focus-visible:outline-none',
        isDark ? 'bg-neutral-800' : 'bg-neutral-200',
      )}
      type='button'
      onClick={toggleTheme}
    >
      <span
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-xs transition-transform duration-200 dark:bg-neutral-900',
          isDark
            ? 'translate-x-7 text-[#f59e0b]'
            : 'translate-x-0 text-[#ba8c25]',
        )}
      >
        {isDark ? <Moon className='h-3 w-3' /> : <Sun className='h-3 w-3' />}
      </span>
      <span className='sr-only'>Toggle theme</span>
    </button>
  )
}

export { ThemeSwitch }
