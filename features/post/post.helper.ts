/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyLocalization } from '@/utils/localization'

const transformPost = <T extends Record<string, any>>(
  post: T | null,
): T | null => {
  if (!post) {
    return null
  }

  const result = applyLocalization(post) as any

  if (result.category) {
    result.category = applyLocalization(result.category)
  }

  if (result.tags && Array.isArray(result.tags)) {
    result.tags = result.tags.map((tag: any) => applyLocalization(tag))
  }

  return result as T
}

export { transformPost }
