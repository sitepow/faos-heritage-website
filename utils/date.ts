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
  if (!value) return null

  const date = value instanceof Date ? value : new Date(value)

  if (isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat(locale, options).format(date)
}

export { formatDate }
