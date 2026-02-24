const applyLocalization = <T extends Record<string, any>>(
  data: T | null | undefined,
): T | null => {
  if (!data) {
    return null
  }

  const result = { ...data }

  const localization = data.localizations?.[0]
  if (localization) {
    const fieldsToLocalize = [
      'name',
      'description',
      'summary',
      'content',
      'title',
      'metaTitle',
      'metaDescription',
      'unit',
    ]
    fieldsToLocalize.forEach((field) => {
      if (field in localization && localization[field]) {
        ;(result as any)[field] = localization[field]
      }
    })
  }

  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        ;(result as any)[key] = value.map((item) =>
          item && typeof item === 'object' && 'localizations' in item
            ? applyLocalization(item)
            : item,
        )
      } else if ('localizations' in value) {
        ;(result as any)[key] = applyLocalization(value)
      }
    }
  })

  return result
}

export { applyLocalization }
