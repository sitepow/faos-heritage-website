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

import { CountryFlag } from '../country-flag'

import { useAppStore } from '@/app/store'
import { usePathname, useRouter } from '@/i18n/navigation'
import { CURRENCY_LOCALE_MAP } from '@/utils/constants/currency'

export const Country = () => {
  const t = useTranslations('Localization')
  const tCountry = useTranslations('Country')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const selectedCountry = CURRENCY_LOCALE_MAP.find(
    (item) => item.country.toLowerCase() === locale,
  )

  const { country, hasHydrated, setState } = useAppStore()

  const changeLocale = (countryCode: string) => {
    router.push(pathname, {
      locale: countryCode.toLowerCase(),
    })
  }

  if (!hasHydrated) return null

  return (
    <div className='flex items-center gap-2'>
      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <Button
            variant='light'
            startContent={<GlobeIcon />}
            className='text-secondary p-0'
          >
            <div className='flex items-center gap-2'>
              <span>
                {selectedCountry
                  ? tCountry(selectedCountry.country)
                  : t('country')}
              </span>
              <ChevronDownIcon size={14} />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          selectionMode='single'
          selectedKeys={selectedCountry ? [selectedCountry.country] : []}
          onSelectionChange={(keys) =>
            changeLocale(Array.from(keys)[0] as string)
          }
        >
          {CURRENCY_LOCALE_MAP.map((item) => (
            <DropdownItem key={item.country}>
              <div className='flex items-center gap-2'>
                <CountryFlag countryCode={item.country} />
                {tCountry(item.country)}
              </div>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <Button variant='light' className='text-secondary p-0'>
            <div className='flex items-center gap-1'>
              <span className='uppercase'>
                {country ? country.currency : t('currency')}
              </span>
              <ChevronDownIcon size={14} />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
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
            <DropdownItem key={item.locale}>
              {tCountry(item.country)} ({item.currency})
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
