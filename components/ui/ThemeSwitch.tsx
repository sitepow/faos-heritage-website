'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
} from '@heroui/react'
import { ChevronDownIcon, SunMoonIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { useIsMounted } from '@/hooks/useIsMounted'
import { getSingleKey } from '@/utils'

type ThemeValue = 'light' | 'dark' | 'system'

interface ThemeSwitchProps {
  className?: string
}

const THEME_OPTIONS: ThemeValue[] = ['light', 'dark', 'system']

const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const tTheme = useTranslations('theme')

  const { theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  const currentTheme = (theme ?? 'system') as ThemeValue

  if (!isMounted) {
    return
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Dropdown>
        <DropdownTrigger>
          <Button
            className='text-secondary px-2'
            startContent={<SunMoonIcon />}
            variant='light'
          >
            <span className='flex items-center gap-2'>
              <span className='capitalize'>{tTheme(currentTheme)}</span>
              <ChevronDownIcon size={14} />
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
