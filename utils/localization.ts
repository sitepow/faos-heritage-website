const applyLocalization = <T extends Record<string, any>>(
  data: T | null | undefined,
): T | null => {
  if (!data) {
    return null
  }

  const localization = data.localizations?.[0]

  if (!localization) {
    return data
  }

  const result = { ...data }

  const fieldsToLocalize = ['name', 'description', 'shortDescription', 'unit']

  fieldsToLocalize.forEach((field) => {
    if (field in result && localization[field]) {
      ;(result as any)[field] = localization[field]
    }
  })

  return result
}

export { applyLocalization }
