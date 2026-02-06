import type { SharedSelection } from '@heroui/system'

/**
 * Remove null / undefined / empty string fields from object
 */
const omitEmptyFields = <T extends Record<string, unknown>>(
  value: T | null | undefined,
): Partial<T> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      ([, v]) => v !== null && v !== undefined && v !== '',
    ),
  ) as Partial<T>
}

const getSingleKey = <T extends string>(keys: SharedSelection) => {
  if (keys === 'all') return undefined
  return Array.from(keys)[0] as T | undefined
}

const calculateTotalPrice = (price: number, quantity: number) => {
  return (price ?? 0) * (quantity ?? 0)
}

export { omitEmptyFields, getSingleKey, calculateTotalPrice }
