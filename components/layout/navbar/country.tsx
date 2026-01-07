'use client'

import { Select, SelectItem } from '@heroui/react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { useAppStore } from '@/app/store'
import { CountryFlag } from '@/components/common/country-flag'
import { usePathname, useRouter } from '@/i18n/navigation'
import { CURRENCY_LOCALE_MAP } from '@/utils/constants'
import { getUsdExchangeRates } from '@/utils/currency/exchange-rate'

export const Country = () => {
  const tCountry = useTranslations('Country')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const selectedCountry = CURRENCY_LOCALE_MAP.find(
    (item) => item.country.toLowerCase() === locale,
  )

  const { country, hasHydrated, exchangeRates, setState, setExchangeRates } =
    useAppStore()

  const changeLocale = (countryCode: string) => {
    router.push(pathname, {
      locale: countryCode.toLowerCase(),
    })
  }

  useEffect(() => {
    if (!hasHydrated || exchangeRates) return
    getUsdExchangeRates().then(setExchangeRates)
  }, [hasHydrated, exchangeRates, setExchangeRates])

  if (!hasHydrated) return null

  return (
    <div className='flex gap-2'>
      <Select
        variant='faded'
        size='lg'
        disallowEmptySelection
        className='min-w-40 sm:min-w-52'
        selectedKeys={selectedCountry ? [selectedCountry.country] : []}
        renderValue={() =>
          selectedCountry ? (
            <div className='flex items-center gap-2'>
              <CountryFlag countryCode={selectedCountry.country} />
              <span>{tCountry(selectedCountry.country)}</span>
            </div>
          ) : null
        }
        onSelectionChange={(keys) => {
          const countryCode = Array.from(keys)[0] as string
          changeLocale(countryCode)
        }}
      >
        {CURRENCY_LOCALE_MAP.map((item) => (
          <SelectItem key={item.country} textValue={item.name}>
            <div className='flex items-center gap-2'>
              <CountryFlag countryCode={item.country} />
              <span>{tCountry(item.country)}</span>
            </div>
          </SelectItem>
        ))}
      </Select>

      <Select
        variant='faded'
        size='lg'
        disallowEmptySelection
        className='min-w-40 sm:min-w-52'
        selectedKeys={country ? [country.locale] : []}
        renderValue={(items) =>
          items.map((item) => {
            const selected = CURRENCY_LOCALE_MAP.find(
              (currency) => currency.locale === item.key,
            )

            if (!selected) {
              return null
            }

            return <span key={item.key}>{selected.currency}</span>
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
            <div className='flex gap-1'>
              <span>{tCountry(item.country)}</span>
              <span className='text-primary text-sm'>({item.currency})</span>
            </div>
          </SelectItem>
        ))}
      </Select>
    </div>
  )
}
