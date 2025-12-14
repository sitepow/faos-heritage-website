const formatDate = (
  value: Date | string | number,
  locale = 'en-EN',
  options?: Intl.DateTimeFormatOptions,
) => {
  if (!value) return 'Date unknown'

  const date = value instanceof Date ? value : new Date(value)

  return new Intl.DateTimeFormat(
    locale,
    options || {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(date)
}

export { formatDate }
