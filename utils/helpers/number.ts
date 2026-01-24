import { Prisma } from '@prisma/client'

import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '../constants/currency'

export type DecimalToNumber<T> = T extends Prisma.Decimal
  ? number
  : T extends Date
    ? Date
    : T extends Array<infer U>
      ? Array<DecimalToNumber<U>>
      : T extends object
        ? { [K in keyof T]: DecimalToNumber<T[K]> }
        : T

interface FormatCurrencyOptions {
  currency?: string
  locale?: string
}

export const formatCurrency = (
  thbValue: number,
  options?: FormatCurrencyOptions & {
    rates?: Record<string, number> | null
  },
) => {
  const currency = options?.currency ?? DEFAULT_CURRENCY
  const locale = options?.locale ?? DEFAULT_LOCALE
  const rates = options?.rates

  let value = thbValue

  if (currency !== 'THB' && rates?.[currency]) {
    value = thbValue * rates[currency]
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

export const formatCurrencyRange = (
  minThb: number,
  maxThb: number,
  options?: FormatCurrencyOptions & {
    rates?: Record<string, number> | null
  },
) => {
  const currency = options?.currency ?? DEFAULT_CURRENCY
  const locale = options?.locale ?? DEFAULT_LOCALE
  const rates = options?.rates

  let min = minThb
  let max = maxThb

  if (currency !== 'THB' && rates?.[currency]) {
    const rate = rates[currency]
    min = minThb * rate
    max = maxThb * rate
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).formatRange(min, max)
}

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value)
}

export const formatNumberRange = (min: number, max: number) => {
  return new Intl.NumberFormat().formatRange(min, max)
}

export const decimalToNumber = <T>(data: T): DecimalToNumber<T> => {
  if (data instanceof Prisma.Decimal) {
    return data.toNumber() as DecimalToNumber<T>
  }

  if (data instanceof Date) {
    return data as DecimalToNumber<T>
  }

  if (Array.isArray(data)) {
    return data.map(decimalToNumber) as DecimalToNumber<T>
  }

  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, decimalToNumber(value)]),
    ) as DecimalToNumber<T>
  }

  return data as DecimalToNumber<T>
}
