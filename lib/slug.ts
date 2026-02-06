import { extractIdFromSlug } from '@/utils'

const parseSlug = (slug: string | string[] | undefined): string => {
  if (!slug) {
    return ''
  }

  const slugStr = Array.isArray(slug) ? slug[slug.length - 1] : slug

  return extractIdFromSlug(slugStr)
}

export { parseSlug }
