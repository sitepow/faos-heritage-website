'use client'

import { Switch } from '@heroui/react'
import { SunIcon, MoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useIsMounted } from '@/hooks/useIsMounted'

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    return setTheme(isDark ? 'light' : 'dark')
  }

  if (!isMounted) {
    return null
  }

  return (
    <Switch
      color='primary'
      endContent={<MoonIcon className='text-default-500' size={12} />}
      isSelected={isDark}
      size='md'
      startContent={<SunIcon className='text-warning' size={12} />}
      onValueChange={toggleTheme}
    />
  )
}

export { ThemeSwitch }
