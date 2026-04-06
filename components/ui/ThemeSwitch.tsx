'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { ChevronDownIcon, SunMoonIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import type { ComponentProps } from 'react'

import { useIsMounted } from '@/hooks/useIsMounted'
import { cn, getSingleKey } from '@/utils'

type ThemeValue = 'light' | 'dark' | 'system'

const THEME_OPTIONS: ThemeValue[] = ['light', 'dark', 'system']

const ThemeSwitch = ({ className }: ComponentProps<'span'>) => {
  const tTheme = useTranslations('theme')

  const { theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  const currentTheme = (theme ?? 'system') as ThemeValue

  if (!isMounted) {
    return
  }

  return (
    <div className='flex items-center'>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className={cn('text-foreground px-2', className)}
            startContent={<SunMoonIcon />}
            variant='light'
          >
            <span className='flex items-center gap-2'>
              <span className='capitalize'>{tTheme(currentTheme)}</span>
              <ChevronDownIcon />
            </span>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          disallowEmptySelection
          aria-label='Theme selection'
          selectedKeys={new Set([currentTheme])}
          selectionMode='single'
          variant='faded'
          onSelectionChange={(keys) => {
            const value = getSingleKey(keys)

            if (value) {
              setTheme(value)
            }
          }}
        >
          {THEME_OPTIONS.map((value) => (
            <DropdownItem key={value}>{tTheme(value)}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export { ThemeSwitch }
