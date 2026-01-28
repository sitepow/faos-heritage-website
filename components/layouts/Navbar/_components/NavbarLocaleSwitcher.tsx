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

import { useAppStore } from '@/app/store'
import { CountryFlagAvatar } from '@/components/ui/CountryFlagAvatar'
import { CURRENCY_LOCALE_MAP } from '@/constants/app'
import { usePathname, useRouter } from '@/i18n/navigation'
import { getSingleKey } from '@/utils/app'

type CountryCode = (typeof CURRENCY_LOCALE_MAP)[number]['country']

const NavbarLocaleSwitcher = () => {
  const translate = useTranslations('Localization')
  const tCountry = useTranslations('Country')

  const routeLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const { appLocale, setAppLocale } = useAppStore()

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

    if (!selected) {
      return
    }

    setAppLocale({
      ...selected,
      name: tCountry(selected.country),
    })
  }

  return (
    <div className='flex items-center gap-2'>
      <Dropdown placement='bottom-end'>
        <DropdownTrigger>
          <Button
            className='text-secondary p-0'
            startContent={<GlobeIcon />}
            variant='light'
          >
            <div className='flex items-center gap-2'>
              <span>
                {selectedByRoute
                  ? tCountry(selectedByRoute.country)
                  : translate('country')}
              </span>
              <ChevronDownIcon />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          selectedKeys={
            selectedByRoute ? new Set([selectedByRoute.country]) : new Set()
          }
          selectionMode='single'
          onSelectionChange={(keys) => {
            const value = getSingleKey<CountryCode>(keys)

            if (value) {
              handleRouteLocaleChange(value)
            }
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
          <Button className='text-secondary p-0' variant='light'>
            <div className='flex items-center gap-1'>
              <span className='uppercase'>
                {appLocale.currency || translate('currency')}
              </span>
              <ChevronDownIcon />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          selectedKeys={new Set([appLocale.locale])}
          selectionMode='single'
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
