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
import { useMemo } from 'react'

import type { SharedSelection } from '@heroui/react'

import { useAppStore } from '@/app/store'
import { CountryFlagAvatar } from '@/components/ui/CountryFlagAvatar'
import { CURRENCY_LOCALE_MAP } from '@/constants/app'
import { usePathname, useRouter } from '@/i18n/navigation'

type CountryCode = (typeof CURRENCY_LOCALE_MAP)[number]['country']

const getSingleKey = <T extends string>(keys: SharedSelection) => {
  if (keys === 'all') return undefined
  return Array.from(keys)[0] as T | undefined
}

const NavbarLocaleSwitcher = () => {
  const t = useTranslations('Localization')
  const tCountry = useTranslations('Country')

  const routeLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const { appLocale, hasHydrated, setAppLocale } = useAppStore()

  const selectedByRoute = useMemo(
    () =>
      CURRENCY_LOCALE_MAP.find(
        (item) => item.country.toLowerCase() === routeLocale,
      ),
    [routeLocale],
  )

  const handleRouteLocaleChange = (nextCountryCode: CountryCode) => {
    router.push(pathname, {
      locale: nextCountryCode.toLowerCase(),
    })
  }

  const handleCurrencyChange = (localeKey: string) => {
    const selected = CURRENCY_LOCALE_MAP.find(
      (item) => item.locale === localeKey,
    )

    if (!selected) return

    setAppLocale({
      ...selected,
      name: tCountry(selected.country),
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
                {selectedByRoute
                  ? tCountry(selectedByRoute.country)
                  : t('country')}
              </span>
              <ChevronDownIcon />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          selectionMode='single'
          selectedKeys={
            selectedByRoute ? new Set([selectedByRoute.country]) : new Set()
          }
          onSelectionChange={(keys) => {
            const value = getSingleKey<CountryCode>(keys)
            if (value) handleRouteLocaleChange(value)
          }}
        >
          {CURRENCY_LOCALE_MAP.map((item) => (
            <DropdownItem key={item.country}>
              <div className='flex items-center gap-2'>
                <CountryFlagAvatar countryCode={item.country} />
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
                {appLocale.currency || t('currency')}
              </span>
              <ChevronDownIcon />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          selectionMode='single'
          selectedKeys={new Set([appLocale.locale])}
          onSelectionChange={(keys) => {
            const value = getSingleKey<string>(keys)
            if (value) handleCurrencyChange(value)
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

export { NavbarLocaleSwitcher }
