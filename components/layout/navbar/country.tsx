'use client'

import { Select, SelectItem } from '@heroui/react'
import { useEffect } from 'react'

import { useAppStore } from '@/app/store'
import { CountryFlag } from '@/components/common/country-flag'
import { CURRENCY_LOCALE_MAP } from '@/utils/constants'
import { getUsdExchangeRates } from '@/utils/currency/exchange-rate'

export const Country = () => {
  const { country, hasHydrated, exchangeRates, setState, setExchangeRates } =
    useAppStore()

  useEffect(() => {
    if (!hasHydrated) return

    if (!country) {
      const defaultCountry = CURRENCY_LOCALE_MAP.find(
        (item) => item.locale === 'en-US',
      )

      if (defaultCountry) {
        setState({ country: defaultCountry })
      }
    }
  }, [hasHydrated, country, setState])

  useEffect(() => {
    if (!hasHydrated || exchangeRates) {
      return
    }

    getUsdExchangeRates().then(setExchangeRates)
  }, [hasHydrated, exchangeRates, setExchangeRates])

  if (!hasHydrated) {
    return null
  }

  return (
    <Select
      variant='faded'
      size='lg'
      disallowEmptySelection
      className='min-w-64'
      selectedKeys={country ? [country.locale] : []}
      renderValue={(items) =>
        items.map((item) => {
          const selected = CURRENCY_LOCALE_MAP.find(
            (currency) => currency.locale === item.key,
          )

          if (!selected) {
            return null
          }

          return (
            <div key={item.key} className='flex items-center gap-2'>
              <CountryFlag countryCode={selected.country} />
              <span>
                {selected.name}{' '}
                <span className='text-default-400 text-xs'>
                  ({selected.currency})
                </span>
              </span>
            </div>
          )
        })
      }
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
            <CountryFlag countryCode={item.country} />
            <span>{item.name}</span>
            <span className='text-default-400 text-xs'>({item.currency})</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  )
}
