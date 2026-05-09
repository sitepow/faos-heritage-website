'use client'

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react'
import { ChevronDownIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo } from 'react'

import type { ComponentProps } from 'react'

import { useAppStore } from '@/app/store'
import { CountryFlagAvatar } from '@/components/ui/CountryFlagAvatar'
import { CURRENCY_LOCALE_MAP } from '@/constants'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn, getSingleKey } from '@/utils'

type CountryCode = (typeof CURRENCY_LOCALE_MAP)[number]['country']

const NavbarLocaleSwitcher = ({ className }: ComponentProps<'span'>) => {
  const tCountry = useTranslations('global.country')

  const routeLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const { appLocale, setAppLocale } = useAppStore()

  const selectedByRoute = useMemo(
    () =>
      CURRENCY_LOCALE_MAP.find(
        (item) => item.country.toLowerCase() === routeLocale.toLowerCase(),
      ),
    [routeLocale],
  )

  useEffect(() => {
    if (selectedByRoute) {
      setAppLocale({
        ...selectedByRoute,
        name: tCountry(selectedByRoute.country),
      })
    }
  }, [selectedByRoute, setAppLocale, tCountry])

  const handleRouteLocaleChange = (nextCountryCode: CountryCode) => {
    const selected = CURRENCY_LOCALE_MAP.find(
      (item) => item.country === nextCountryCode,
    )

    if (selected) {
      setAppLocale({
        ...selected,
        name: tCountry(selected.country),
      })
    }

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
            className={cn('text-foreground p-0', className)}
            startContent={<CountryFlagAvatar countryCode={appLocale.country} />}
            variant='light'
          >
            <div className='flex items-center gap-2'>
              <span>
                {selectedByRoute
                  ? tCountry(selectedByRoute.country)
                  : tCountry('country')}
              </span>
              <ChevronDownIcon />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          className='h-auto overflow-y-scroll'
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
          <Button
            className={cn('text-foreground p-0', className)}
            variant='light'
          >
            <div className='flex items-center gap-1'>
              <span className='uppercase'>
                {appLocale.currency || tCountry('currency')}
              </span>
              <ChevronDownIcon />
            </div>
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          className='h-[250px] overflow-y-scroll'
          selectedKeys={new Set([appLocale.locale])}
          selectionMode='single'
          onSelectionChange={(keys) => {
            const value = getSingleKey<string>(keys)
            if (value) handleCurrencyChange(value)
          }}
        >
          {CURRENCY_LOCALE_MAP.map((item) => (
            <DropdownItem key={item.locale}>
              {item.currency} - {tCountry(item.country)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export { NavbarLocaleSwitcher }
