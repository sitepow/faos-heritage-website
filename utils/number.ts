import {
  DEFAULT_CURRENCY,
  CURRENCY_LOCALE_MAP,
  DEFAULT_LOCALE,
} from './constants/currency'

interface FormatCurrencyOptions {
  currency?: string
  locale?: string
}

export const formatCurrency = (
  value: number,
  options?: FormatCurrencyOptions,
) => {
  const currency = options?.currency ?? DEFAULT_CURRENCY
  const locale =
    options?.locale ?? CURRENCY_LOCALE_MAP[currency] ?? DEFAULT_LOCALE

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)
}

export const formatCurrencyRange = (
  min: number,
  max: number,
  options?: FormatCurrencyOptions,
) => {
  const currency = options?.currency ?? DEFAULT_CURRENCY
  const locale =
    options?.locale ?? CURRENCY_LOCALE_MAP[currency] ?? DEFAULT_LOCALE

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
