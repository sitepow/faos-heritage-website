import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { prisma } from '@/lib/prisma'

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = process.env.APP_URL!

  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticRoutes = [
    '',
    '/about',
    '/categories',
    '/payment-methods',
    '/privacy-policy',
    '/products',
    '/posts',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  const getLanguages = (routePath: string) => {
    return Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        `${baseUrl}/${locale}${routePath}`,
      ]),
    )
  }

  routing.locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: getLanguages(route),
        },
      })
    })

    products.forEach((product) => {
      if (!product.slug) {
        return
      }

      const path = `/products/${product.slug}`
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: getLanguages(path),
        },
      })
    })

    categories.forEach((category) => {
      if (!category.slug) {
        return
      }

      const path = `/categories/${category.slug}`
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.75,
        alternates: {
          languages: getLanguages(path),
        },
      })
    })

    posts.forEach((post) => {
      if (!post.slug) {
        return
      }

      const path = `/posts/${post.slug}`
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: getLanguages(path),
        },
      })
    })
  })

  return sitemapEntries
}

export default sitemap
