'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { ChevronDownIcon, GlobeIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { useAppStore } from '@/app/store'
import { CountryFlag } from '@/components/country-flag'
import { usePathname, useRouter } from '@/i18n/navigation'
import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'
import { getUsdExchangeRates } from '@/utils/helpers/currency/exchange'

export const Country = () => {
  const t = useTranslations('Localization')
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
    <div className='flex items-center gap-1 sm:gap-3'>
      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <Button
            variant='light'
            className='min-w-0 px-2 sm:px-4'
            isIconOnly={false}
          >
            <div className='flex items-center gap-2'>
              {selectedCountry ? (
                <CountryFlag countryCode={selectedCountry.country} />
              ) : (
                <GlobeIcon size={18} />
              )}
              <span className='hidden sm:inline'>
                {selectedCountry
                  ? tCountry(selectedCountry.country)
                  : t('country')}
              </span>
              <ChevronDownIcon
                size={14}
                className='text-default-400 hidden sm:block'
              />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Country selection'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selectedCountry ? [selectedCountry.country] : []}
          onSelectionChange={(keys) => {
            const countryCode = Array.from(keys)[0] as string
            changeLocale(countryCode)
          }}
        >
          {CURRENCY_LOCALE_MAP.map((item) => (
            <DropdownItem
              key={item.country}
              startContent={<CountryFlag countryCode={item.country} />}
            >
              {tCountry(item.country)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <Button variant='light' className='min-w-0 px-2 sm:px-4'>
            <div className='flex items-center gap-1 sm:gap-2'>
              <span className='text-xs font-semibold uppercase sm:text-sm'>
                {country ? country.currency : t('currency')}
              </span>
              <ChevronDownIcon
                size={14}
                className='text-default-400 hidden sm:block'
              />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Currency selection'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={country ? [country.locale] : []}
          onSelectionChange={(keys) => {
            const localeKey = Array.from(keys)[0] as string
            const selected = CURRENCY_LOCALE_MAP.find(
              (item) => item.locale === localeKey,
            )
            if (selected) setState({ country: selected })
          }}
        >
          {CURRENCY_LOCALE_MAP.map((item) => (
            <DropdownItem
              key={item.locale}
              description={tCountry(item.country)}
            >
              {item.currency}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
