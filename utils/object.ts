/* eslint-disable no-unused-vars */

export const removeEmptyField = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null && value !== ''),
  ) as Partial<T>
}
