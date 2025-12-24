export const formatCurrency = (
  value: number,
  currency = 'THB',
  locale = 'th-TH',
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

export const formatCurrencyRange = (
  min: number,
  max: number,
  currency = 'THB',
  locale = 'th-TH',
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).formatRange(min, max)
}

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value)
}

export const formatNumberRange = (
  min: number,
  max: number,
  locale = 'th-TH',
) => {
  return new Intl.NumberFormat(locale, {}).formatRange(min, max)
}
