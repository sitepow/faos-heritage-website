'use client'

import { Switch, cn } from '@heroui/react'
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
      classNames={{
        base: cn(
          'inline-flex w-full max-w-full flex-row-reverse items-center',
          'h-10 cursor-pointer justify-between gap-2 rounded-xl px-2',
          'hover:bg-default-100 transition-all duration-200',
        ),
        wrapper: 'p-0 h-5 w-10 overflow-visible bg-default-200',
        thumb: cn(
          'h-5 w-5 border-2 shadow-sm',
          'group-data-[selected=true]:ml-5',
          'group-data-[selected=true]:border-primary bg-background',
          'group-data-[selected=false]:border-default',
        ),
      }}
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
