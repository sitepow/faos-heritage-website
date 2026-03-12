type FormatDateValue = Date | string | number | null | undefined
type FormatType = 'full' | 'date' | 'dateTime' | 'short' | 'time'

const DATE_CONFIGS: Record<FormatType, Intl.DateTimeFormatOptions> = {
  full: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  date: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  dateTime: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  short: {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  },
  time: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
}

const formatDate = (
  value: FormatDateValue,
  locale: string = 'th',
  formatType: FormatType = 'full',
  customOptions?: Intl.DateTimeFormatOptions,
): string | null => {
  if (!value) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  if (isNaN(date.getTime())) {
    return null
  }

  const targetLocale = locale === 'th' ? 'th-TH' : locale
  const options = customOptions || DATE_CONFIGS[formatType]

  return new Intl.DateTimeFormat(targetLocale, options).format(date)
}

const formatCompactNumber = (number: number, locale: string = 'th'): string => {
  const targetLocale = locale === 'th' ? 'th-TH' : locale

  return new Intl.NumberFormat(targetLocale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(number)
}

export { formatDate, formatCompactNumber }
export type { FormatDateValue, FormatType }
