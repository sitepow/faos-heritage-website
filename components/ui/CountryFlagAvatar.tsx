import { Avatar, type AvatarProps } from '@heroui/react'

import { cn } from '@/utils/style'

type ISO2CountryCode = string

interface CountryFlagAvatarProps extends Omit<AvatarProps, 'src'> {
  countryCode: ISO2CountryCode
}

const getCountryFlagUrl = (countryCode: ISO2CountryCode) =>
  `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`

const CountryFlagAvatar = ({
  countryCode,
  className,
  size = 'sm',
  alt,
  ...props
}: CountryFlagAvatarProps) => {
  return (
    <Avatar
      {...props}
      size={size}
      className={cn('shrink-0', className)}
      src={getCountryFlagUrl(countryCode)}
      alt={alt ?? countryCode}
    />
  )
}

export { CountryFlagAvatar }
