import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { prisma } from '@/lib/prisma'
import { generateSlugWithId } from '@/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL!

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      updatedAt: true,
    },
  })

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
    },
  })

  const staticRoutes = [
    '',
    '/about',
    '/categories',
    '/payment-methods',
    '/privacy-policy',
    '/products',
  ]

  const sitemap: MetadataRoute.Sitemap = []

  routing.locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    })

    products.forEach((product) => {
      if (!product.name) {
        return
      }

      sitemap.push({
        url: `${baseUrl}/${locale}/products/${generateSlugWithId(
          product.name,
          product.id,
        )}`,
        lastModified: product.updatedAt ?? new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })

    categories.forEach((category) => {
      if (!category.name) {
        return
      }

      sitemap.push({
        url: `${baseUrl}/${locale}/categories/${generateSlugWithId(
          category.name,
          category.id,
        )}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    })
  })

  return sitemap
}
