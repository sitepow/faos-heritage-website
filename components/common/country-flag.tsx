import { Avatar } from '@heroui/react'

import type { AvatarProps } from '@heroui/react'

import { cn } from '@/utils/style'

type CountryFlagProps = AvatarProps & {
  countryCode: string
}

export const CountryFlag = ({
  countryCode,
  className,
  size = 'sm',
  ...props
}: CountryFlagProps) => {
  return (
    <Avatar
      size={size}
      className={cn('shrink-0', className)}
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`}
      {...props}
    />
  )
}
