'use client'

import { Select, SelectItem, Avatar } from '@heroui/react'
import { useEffect } from 'react'

import { useAppStore } from '@/app/store'
import { CURRENCY_LOCALE_MAP } from '@/utils/constants'

export const Country = () => {
  const { country, hasHydrated, setState } = useAppStore()

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    if (!country) {
      const defaultCountry = CURRENCY_LOCALE_MAP.find(
        (item) => item.locale === 'en-US',
      )

      if (defaultCountry) {
        setState({ country: defaultCountry })
      }
    }
  }, [hasHydrated, country, setState])

  if (!hasHydrated) {
    return null
  }

  return (
    <Select
      label='Country'
      variant='bordered'
      disallowEmptySelection
      className='min-w-72'
      selectedKeys={country ? [country.locale] : []}
      onSelectionChange={(keys) => {
        const locale = Array.from(keys)[0] as string

        const selected = CURRENCY_LOCALE_MAP.find(
          (item) => item.locale === locale,
        )

        if (selected) {
          setState({ country: selected })
        }
      }}
    >
      {CURRENCY_LOCALE_MAP.map((item) => (
        <SelectItem key={item.locale} textValue={item.name}>
          <div className='flex items-center gap-2'>
            <Avatar
              alt={item.country}
              className='shrink-0'
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${item.country}.svg`}
            />
            <span>{item.name}</span>
            <span className='text-default-400 text-xs'>({item.currency})</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  )
}
