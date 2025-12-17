const formatCurrency = (value: number, currency = 'THB', locale = 'th-TH') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

const formatCurrencyRange = (
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

const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value)
}

const formatNumberRange = (min: number, max: number, locale = 'th-TH') => {
  return new Intl.NumberFormat(locale, {}).formatRange(min, max)
}

export { formatCurrencyRange, formatCurrency, formatNumber, formatNumberRange }
