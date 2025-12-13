type NullableNumber = number | null | undefined

interface RangeInput {
  min?: NullableNumber
  max?: NullableNumber
  fallback?: NullableNumber
}

const getRangeDisplayValue = <T>(
  { min, max, fallback }: RangeInput,
  options: {
    formatSingle: (value: number) => T
    formatRange: (min: number, max: number) => T
  },
): T | null => {
  if (typeof min === 'number' && typeof max === 'number') {
    return min !== max
      ? options.formatRange(min, max)
      : options.formatSingle(min)
  }

  if (typeof fallback === 'number') {
    return options.formatSingle(fallback)
  }

  return null
}

export { getRangeDisplayValue }
