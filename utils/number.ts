import type { Decimal } from '@prisma/client/runtime/library'

const formatCurrency = (
  value: number | Decimal,
  currency = 'THB',
  locale = 'th-TH',
) => {
  const numValue = typeof value === 'number' ? value : value.toNumber()

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(numValue)
}

const formatNumber = (value: number | Decimal, decimals = 0) => {
  const numValue = typeof value === 'number' ? value : value.toNumber()

  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue)
}

export { formatCurrency, formatNumber }
