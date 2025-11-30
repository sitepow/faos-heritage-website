import { useSwitch, type SwitchProps } from '@heroui/switch'
import { useIsSSR } from '@react-aria/ssr'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import type { FC } from 'react'

import { cn } from '@/utils/style'

export interface Props {
  className?: string
  classNames?: SwitchProps['classNames']
}

const ThemeSwitch: FC<Props> = ({ className, classNames }) => {
  const { theme, setTheme } = useTheme()
  const isSSR = useIsSSR()

  const onChange = () => {
    theme === 'light' ? setTheme('dark') : setTheme('light')
  }

  const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch({
    isSelected: theme === 'light' || isSSR,
    'aria-label': `Switch to ${theme === 'light' || isSSR ? 'dark' : 'light'} mode`,
    onChange,
  })

  return (
    <Component
      {...getBaseProps({
        className: cn('cursor-pointer px-px transition-opacity', className, classNames?.base),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: cn(
            [
              'h-auto w-auto',
              'bg-transparent',
              'rounded-lg',
              'flex items-center justify-center',
              'group-data-[selected=true]:bg-transparent',
              'pt-px',
              'px-0',
              'mx-0',
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <SunIcon className='text-white' size={22} />
        ) : (
          <MoonIcon className='text-black' size={22} />
        )}
      </div>
    </Component>
  )
}

export { ThemeSwitch }
