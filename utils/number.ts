import { Prisma } from '@prisma/client'

import { CURRENCY } from '@/constants'

type DecimalToNumber<T> = T extends Prisma.Decimal
  ? number
  : T extends Date
    ? Date
    : T extends Array<infer U>
      ? Array<DecimalToNumber<U>>
      : T extends object
        ? { [K in keyof T]: DecimalToNumber<T[K]> }
        : T

interface CurrencyFormatOptions {
  currency?: string
  locale?: string
  rates?: Record<string, number> | null
  skipCalculation?: boolean
}

const resolveCurrencyValue = (
  value: number,
  currency: string,
  rates?: Record<string, number> | null,
  skipCalculation: boolean = false,
) => {
  if (skipCalculation) {
    return value
  }

  if (currency === 'THB' || currency === 'TH') {
    return value
  }

  if (!rates || !rates[currency]) {
    return value
  }

  return value * rates[currency]
}

const APP_LOCALE_TO_INTL: Record<string, string> = {
  th: 'th-TH',
  us: 'en-US',
  jp: 'ja-JP',
  vn: 'vi-VN',
}

const getCurrencyFormatter = (locale: string, currency: string) => {
  const targetLocale = APP_LOCALE_TO_INTL[locale.toLowerCase()] || locale
  return new Intl.NumberFormat(targetLocale, {
    style: 'currency',
    currency: currency === 'TH' ? 'THB' : currency,
  })
}

const formatCurrency = (
  value: number,
  {
    currency = CURRENCY.DEFAULT_CODE,
    locale = CURRENCY.DEFAULT_LOCALE,
    rates,
    skipCalculation = false,
  }: CurrencyFormatOptions = {},
) => {
  const finalValue = resolveCurrencyValue(
    value,
    currency,
    rates,
    skipCalculation,
  )
  return getCurrencyFormatter(locale, currency).format(finalValue)
}

const formatCurrencyRange = (
  minValue: number,
  maxValue: number,
  {
    currency = CURRENCY.DEFAULT_CODE,
    locale = CURRENCY.DEFAULT_LOCALE,
    rates,
  }: CurrencyFormatOptions = {},
) => {
  const formatter = getCurrencyFormatter(locale, currency)

  const min = resolveCurrencyValue(minValue, currency, rates)
  const max = resolveCurrencyValue(maxValue, currency, rates)

  return formatter.formatRange(min, max)
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value)

const formatNumberRange = (min: number, max: number) =>
  new Intl.NumberFormat().formatRange(min, max)

const decimalToNumber = <T>(data: T): DecimalToNumber<T> => {
  if (data instanceof Prisma.Decimal) {
    return data.toNumber() as DecimalToNumber<T>
  }

  if (data instanceof Date || data === null) {
    return data as DecimalToNumber<T>
  }

  if (Array.isArray(data)) {
    return data.map(decimalToNumber) as DecimalToNumber<T>
  }

  if (typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, decimalToNumber(value)]),
    ) as DecimalToNumber<T>
  }

  return data as DecimalToNumber<T>
}

export {
  formatCurrency,
  formatCurrencyRange,
  formatNumber,
  formatNumberRange,
  decimalToNumber,
}
export type { DecimalToNumber, CurrencyFormatOptions }
