import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const COUNTRY_CONFIG = {
  TH: { locale: 'th-TH' },
  US: { locale: 'en-US' },
}

async function getDynamicPaths() {
  const [products, categories, posts] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true },
    }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    }),
  ])

  const staticSlugs = [
    '',
    '/about',
    '/categories',
    '/payment-methods',
    '/privacy-policy',
    '/products',
    '/posts',
  ]
  const countryCodes = Object.keys(COUNTRY_CONFIG).map((c) => c.toLowerCase())
  const results = []

  countryCodes.forEach((lang) => {
    staticSlugs.forEach((slug) => results.push({ lang, relativeSlug: slug }))
    products.forEach((p) =>
      results.push({ lang, relativeSlug: `/products/${p.slug}` }),
    )
    categories.forEach((c) =>
      results.push({ lang, relativeSlug: `/categories/${c.slug}` }),
    )
    posts.forEach((post) =>
      results.push({ lang, relativeSlug: `/posts/${post.slug}` }),
    )
  })

  await prisma.$disconnect()
  return results
}

export default {
  siteUrl: 'https://faos.asia',
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const paths = await getDynamicPaths()
    return paths.map((p) => ({
      loc: `/${p.lang}${p.relativeSlug}`,
      changefreq: 'daily',
      priority: 0.7,
    }))
  },
}
