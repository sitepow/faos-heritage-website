import { siteConfig } from '@/config/site'

const getFooter = () => {
  return ` Copyright ${new Date().getFullYear()} ${siteConfig.name} - ${siteConfig.title}`
}

const createSlug = (name: string, id: number | string): string => {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0E00-\u0E7Fa-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `${slug}-${id}`
}

const getIdFromSlug = (slug: string): string => {
  const parts = slug.split('-').filter(Boolean)

  return parts[parts.length - 1] || ''
}

const removeEmptyField = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {} as Partial<T>
  }

  const cleanedEntries = Object.entries(obj).filter(([_, value]) => {
    return value != null && value !== ''
  })

  return Object.fromEntries(cleanedEntries) as Partial<T>
}

export { createSlug, getFooter, getIdFromSlug, removeEmptyField }
