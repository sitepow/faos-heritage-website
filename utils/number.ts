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
    maximumFractionDigits: 0,
  }).formatRange(min, max)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value)
}

export { formatCurrencyRange, formatCurrency, formatNumber }
