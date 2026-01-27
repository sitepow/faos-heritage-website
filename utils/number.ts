import { Prisma } from '@prisma/client'

import { CURRENCY } from '@/constants/app'

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
}

const resolveCurrencyValue = (
  thbValue: number,
  currency: string,
  rates?: Record<string, number> | null,
) => {
  if (currency === 'THB') return thbValue
  if (!rates?.[currency]) return thbValue
  return thbValue * rates[currency]
}

const getCurrencyFormatter = (locale: string, currency: string) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })

const formatCurrency = (
  thbValue: number,
  {
    currency = CURRENCY.DEFAULT_CODE,
    locale = CURRENCY.DEFAULT_LOCALE,
    rates,
  }: CurrencyFormatOptions = {},
) => {
  const value = resolveCurrencyValue(thbValue, currency, rates)
  return getCurrencyFormatter(locale, currency).format(value)
}

const formatCurrencyRange = (
  minThb: number,
  maxThb: number,
  {
    currency = CURRENCY.DEFAULT_CODE,
    locale = CURRENCY.DEFAULT_LOCALE,
    rates,
  }: CurrencyFormatOptions = {},
) => {
  const formatter = getCurrencyFormatter(locale, currency)

  const min = resolveCurrencyValue(minThb, currency, rates)
  const max = resolveCurrencyValue(maxThb, currency, rates)

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
