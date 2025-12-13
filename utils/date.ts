const formatDate = (
  value: Date | string | number,
  locale = 'th-TH',
  options?: Intl.DateTimeFormatOptions,
) => {
  if (!value) return 'ไม่ทราบวันที่'

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
