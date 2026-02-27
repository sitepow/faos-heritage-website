const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const COUNTRY_CONFIG = {
  TH: { locale: 'th-TH' },
  US: { locale: 'en-US' },
  GR: { locale: 'el-GR' },
  IT: { locale: 'it-IT' },
  NL: { locale: 'nl-NL' },
  MY: { locale: 'ms-MY' },
  SG: { locale: 'en-SG' },
  JP: { locale: 'ja-JP' },
  CN: { locale: 'zh-CN' },
  IS: { locale: 'is-IS' },
  VN: { locale: 'vi-VN' },
  ID: { locale: 'id-ID' },
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
    'about',
    'categories',
    'payment-methods',
    'privacy-policy',
    'products',
    'posts',
  ]
  const countryCodes = Object.keys(COUNTRY_CONFIG).map((c) => c.toLowerCase())
  const results = []

  countryCodes.forEach((lang) => {
    staticSlugs.forEach((slug) => {
      results.push({
        lang,
        relativeSlug: slug ? `/${slug}` : '',
        isHome: slug === '',
      })
    })

    products.forEach((p) =>
      results.push({
        lang,
        relativeSlug: `/products/${p.slug}`,
        isHome: false,
      }),
    )
    categories.forEach((c) =>
      results.push({
        lang,
        relativeSlug: `/categories/${c.slug}`,
        isHome: false,
      }),
    )
    posts.forEach((post) =>
      results.push({
        lang,
        relativeSlug: `/posts/${post.slug}`,
        isHome: false,
      }),
    )
  })

  await prisma.$disconnect()
  return results
}

module.exports = { getDynamicPaths }
