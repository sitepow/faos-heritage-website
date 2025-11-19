const formatCurrency = (value: number, currency = 'THB', locale = 'th-TH') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat().format(value)
}

export { formatCurrency, formatNumber }
