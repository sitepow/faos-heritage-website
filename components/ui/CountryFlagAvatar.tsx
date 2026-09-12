/* eslint-disable @next/next/no-img-element */
import type { ComponentProps } from 'react'

import { cn } from '@/utils/style'

type ISO2CountryCode = string

interface CountryFlagAvatarProps extends ComponentProps<'div'> {
  countryCode: ISO2CountryCode
  size?: 'sm' | 'md' | 'lg'
  alt?: string
}

const getCountryFlagUrl = (countryCode: ISO2CountryCode) =>
  `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`

const sizeClasses = {
  sm: 'h-3.5 w-5 rounded-[2px]',
  md: 'h-4 w-6 rounded-[3px]',
  lg: 'h-5 w-7 rounded-[3px]',
}

const CountryFlagAvatar = ({
  countryCode,
  className,
  size = 'sm',
  alt,
  ...props
}: CountryFlagAvatarProps) => {
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-black/10 shadow-2xs dark:border-white/10',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <img
        alt={alt ?? countryCode}
        className='h-full w-full object-cover'
        loading='lazy'
        src={getCountryFlagUrl(countryCode)}
      />
    </div>
  )
}

export { CountryFlagAvatar }
