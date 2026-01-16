'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { MonitorCogIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { cn } from '@/utils/style'

interface ThemeSwitchProps {
  className?: string
}

export const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const t = useTranslations('Common.theme')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className='size-10' />

  return (
    <div className={cn('flex items-center', className)}>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant='light'>
            {theme === 'light' && <SunIcon />}
            {theme === 'dark' && <MoonIcon />}
            {theme === 'system' && <MonitorCogIcon />}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Theme selection'
          variant='faded'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={new Set([theme || 'system'])}
          onSelectionChange={(keys) => {
            const selectedValue = Array.from(keys)[0] as string
            setTheme(selectedValue)
          }}
        >
          <DropdownItem key='light' startContent={<SunIcon />}>
            {t('light')}
          </DropdownItem>
          <DropdownItem key='dark' startContent={<MoonIcon />}>
            {t('dark')}
          </DropdownItem>
          <DropdownItem key='system' startContent={<MonitorCogIcon />}>
            {t('system')}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
