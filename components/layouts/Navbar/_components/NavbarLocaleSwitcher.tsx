'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef } from 'react'

import type { ComponentProps } from 'react'

import { useAppStore } from '@/app/store'
import { CountryFlagAvatar } from '@/components/ui/CountryFlagAvatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CURRENCY_LOCALE_MAP } from '@/constants'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/utils'

type CountryCode = (typeof CURRENCY_LOCALE_MAP)[number]['country']

interface NavbarLocaleSwitcherProps extends ComponentProps<'div'> {
  showCurrency?: boolean
}

const NavbarLocaleSwitcher = ({
  className,
  showCurrency = true,
}: NavbarLocaleSwitcherProps) => {
  const tCountry = useTranslations('global.country')

  const routeLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const { appLocale, setAppLocale } = useAppStore()
  const prevRouteLocaleRef = useRef(routeLocale)

  const selectedByRoute = useMemo(
    () =>
      CURRENCY_LOCALE_MAP.find(
        (item) => item.country.toLowerCase() === routeLocale.toLowerCase(),
      ),
    [routeLocale],
  )

  useEffect(() => {
    // Only update appLocale if the route locale actually changed (e.g. navigated to /us, /jp, /th)
    if (prevRouteLocaleRef.current !== routeLocale) {
      prevRouteLocaleRef.current = routeLocale
      if (selectedByRoute) {
        setAppLocale({
          ...selectedByRoute,
          name: tCountry(selectedByRoute.country),
        })
      }
    } else if (!appLocale?.currency && selectedByRoute) {
      setAppLocale({
        ...selectedByRoute,
        name: tCountry(selectedByRoute.country),
      })
    }
  }, [
    routeLocale,
    selectedByRoute,
    setAppLocale,
    tCountry,
    appLocale?.currency,
  ])

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

  const handleCurrencyChange = (currencyCode: string) => {
    const selected = CURRENCY_LOCALE_MAP.find(
      (item) => item.currency === currencyCode,
    )

    if (!selected) {
      return
    }

    setAppLocale({
      country: selected.country,
      currency: selected.currency,
      locale: selected.locale,
      name: tCountry(selected.country),
    })
  }

  const currentCurrency =
    appLocale?.currency || selectedByRoute?.currency || 'THB'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Country / Language Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className='h-8 gap-1.5 px-2 text-xs font-medium text-neutral-700 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100'
            size='sm'
            variant='ghost'
          >
            <CountryFlagAvatar
              countryCode={
                appLocale?.country || selectedByRoute?.country || 'TH'
              }
            />
            <span className='max-w-[70px] truncate sm:max-w-none'>
              {selectedByRoute
                ? tCountry(selectedByRoute.country)
                : tCountry('country')}
            </span>
            <ChevronDown className='h-3 w-3 opacity-60' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align='end' className='w-44 py-1 shadow-xl'>
          {CURRENCY_LOCALE_MAP.map((item) => {
            const isSelected = selectedByRoute?.country === item.country
            return (
              <DropdownMenuItem
                key={item.country}
                className='flex items-center justify-between py-2 text-xs'
                onClick={() => handleRouteLocaleChange(item.country)}
              >
                <div className='flex items-center gap-2'>
                  <CountryFlagAvatar countryCode={item.country} />
                  <span className='font-medium'>{tCountry(item.country)}</span>
                </div>
                {isSelected && (
                  <Check className='h-3.5 w-3.5 text-[#ba8c25] dark:text-[#f59e0b]' />
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Currency Dropdown */}
      {showCurrency && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className='h-8 gap-1 px-2 text-xs font-medium text-neutral-700 hover:bg-neutral-200/60 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100'
              size='sm'
              variant='ghost'
            >
              <span className='font-semibold tracking-wider uppercase'>
                {currentCurrency}
              </span>
              <ChevronDown className='h-3 w-3 opacity-60' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align='end'
            className='max-h-60 w-48 overflow-y-auto py-1 shadow-xl'
          >
            {CURRENCY_LOCALE_MAP.map((item) => {
              const isSelected = currentCurrency === item.currency
              return (
                <DropdownMenuItem
                  key={item.currency}
                  className='flex items-center justify-between py-2 text-xs'
                  onClick={() => handleCurrencyChange(item.currency)}
                >
                  <div className='flex items-center gap-1.5'>
                    <span className='font-bold uppercase'>{item.currency}</span>
                    <span className='text-neutral-400 dark:text-neutral-500'>
                      -
                    </span>
                    <span className='text-neutral-600 dark:text-neutral-400'>
                      {tCountry(item.country)}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className='h-3.5 w-3.5 text-[#ba8c25] dark:text-[#f59e0b]' />
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export { NavbarLocaleSwitcher }
