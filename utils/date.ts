type FormatDateValue = Date | string | number | null | undefined

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

const formatDate = (
  value: FormatDateValue,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
): string | null => {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  if (isNaN(date.getTime())) {
    return null
  }

  const targetLocale = locale === 'th' ? 'th-TH' : locale

  return new Intl.DateTimeFormat(targetLocale, options).format(date)
}

const formatCompactNumber = (
  number: number,
  locale: string = 'en-US',
): string => {
  const targetLocale = locale === 'th' ? 'th-TH' : locale

  return new Intl.NumberFormat(targetLocale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(number)
}

export { formatDate, formatCompactNumber }
