'use client'

import { Switch, cn } from '@heroui/react'
import { SunIcon, MoonIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { useIsMounted } from '@/hooks/useIsMounted'

interface Props {
  className?: string
}

const ThemeSwitch = ({ className }: Props) => {
  const { theme, setTheme } = useTheme()
  const isMounted = useIsMounted()

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className={cn('flex w-full items-center px-2 py-1', className)}>
      <Switch
        classNames={{
          base: cn(
            'inline-flex w-full max-w-full flex-row-reverse items-center',
            'h-12 cursor-pointer justify-between gap-2 rounded-lg border-2 border-transparent px-4',
            'hover:bg-default-100 transition-colors',
          ),
          wrapper: 'p-0 h-4 overflow-visible',
          thumb: cn(
            'h-6 w-6 border-2 shadow-lg',
            'group-data-[selected=true]:ml-6',
            'group-data-[selected=true]:border-primary',
            'group-data-[selected=false]:border-default',
          ),
        }}
        color='primary'
        endContent={<MoonIcon size={16} />}
        isSelected={isDark}
        size='lg'
        startContent={<SunIcon size={16} />}
        onValueChange={toggleTheme}
      >
        <div className='flex flex-col'>
          <p className='text-medium font-medium'>
            {isDark ? 'โหมดมืด' : 'โหมดสว่าง'}
          </p>
        </div>
      </Switch>
    </div>
  )
}

export { ThemeSwitch }
