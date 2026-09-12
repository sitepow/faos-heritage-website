'use client'

import { Check, ChevronDown, Moon, Sun, SunMoon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import type { ComponentProps } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useIsMounted } from '@/hooks/useIsMounted'
import { cn } from '@/utils'

type ThemeValue = 'light' | 'dark' | 'system'

const THEME_OPTIONS: { value: ThemeValue; icon: typeof Sun }[] = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: SunMoon },
]

const ThemeSwitch = ({ className }: ComponentProps<'div'>) => {
  const tTheme = useTranslations('theme')
  const { theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  if (!isMounted) {
    return <div className={cn('h-8 w-16', className)} />
  }

  const currentTheme = (theme ?? 'system') as ThemeValue
  let CurrentIcon = SunMoon
  if (currentTheme === 'light') {
    CurrentIcon = Sun
  } else if (currentTheme === 'dark') {
    CurrentIcon = Moon
  }

  return (
    <div className={cn('flex items-center', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='h-8 gap-1.5 px-2 text-xs font-medium text-neutral-700 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100'
            size='sm'
            variant='ghost'
          >
            <CurrentIcon className='h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 hover:scale-110 dark:text-neutral-400' />
            <span className='capitalize'>{tTheme(currentTheme)}</span>
            <ChevronDown className='h-3 w-3 opacity-60' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-32 py-1'>
          {THEME_OPTIONS.map(({ value, icon: Icon }) => {
            const isSelected = currentTheme === value
            return (
              <DropdownMenuItem
                key={value}
                className='flex items-center justify-between py-1.5 text-xs'
                onClick={() => setTheme(value)}
              >
                <div className='flex items-center gap-2'>
                  <Icon className='h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400' />
                  <span className='capitalize'>{tTheme(value)}</span>
                </div>
                {isSelected && <Check className='h-3.5 w-3.5 text-[#ba8c25]' />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { ThemeSwitch }
