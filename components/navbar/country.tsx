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

import { CountryFlag } from '../country-flag'

import { useAppStore } from '@/app/store'
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
    <div className='flex items-center'>
      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <Button
            variant='light'
            startContent={<GlobeIcon />}
            className='text-secondary p-0'
            isIconOnly={false}
          >
            <div className='flex items-center gap-2'>
              <span>
                {selectedCountry
                  ? tCountry(selectedCountry.country)
                  : t('country')}
              </span>
              <ChevronDownIcon size={14} className='text-secondary' />
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
          classNames={{
            list: 'max-h-[250px] overflow-y-auto scroll-shadow',
          }}
        >
          {CURRENCY_LOCALE_MAP.map((item) => (
            <DropdownItem key={item.country}>
              <div className='flex items-center gap-2'>
                <CountryFlag countryCode={item?.country} />
                <span>{tCountry(item.country)}</span>
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <Button variant='light' className='text-secondary p-0'>
            <div className='flex items-center gap-1 sm:gap-2'>
              <span className='uppercase'>
                {country ? country.currency : t('currency')}
              </span>
              <ChevronDownIcon size={14} className='text-secondary' />
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
          classNames={{
            list: 'max-h-[250px] overflow-y-auto scroll-shadow',
          }}
        >
          {CURRENCY_LOCALE_MAP.map((item) => (
            <DropdownItem key={item.locale}>
              {tCountry(item.country)}{' '}
              <span className='text-primary'>({item.currency} )</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
