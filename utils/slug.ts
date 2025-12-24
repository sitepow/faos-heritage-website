export const createSlug = (name: string, id: number | string): string => {
  if (!name || !id) return ''

  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `${slug}-${id}`
}

export const getIdFromSlug = (slug: string): string => {
  const parts = slug.split('-').filter(Boolean)

  return parts[parts.length - 1] || ''
}

export const getNameFromSlug = (slug: string) =>
  slug
    .split('-')
    .slice(0, -1)
    .join(' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
