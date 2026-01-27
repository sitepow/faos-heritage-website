'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { ChevronDownIcon } from 'lucide-react'
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
          <Button
            variant='light'
            className='text-secondary p-0'
            isIconOnly={false}
          >
            <div className='flex items-center gap-2'>
              <span>{t(theme ?? 'system')}</span>
              <ChevronDownIcon size={14} className='text-secondary' />
            </div>
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
          classNames={{
            list: 'max-h-[250px] overflow-y-auto scroll-shadow',
          }}
        >
          <DropdownItem key='light'>{t('light')}</DropdownItem>
          <DropdownItem key='dark'>{t('dark')}</DropdownItem>
          <DropdownItem key='system'>{t('system')}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
