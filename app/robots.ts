import type { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => {
  const baseUrl = process.env.APP_URL!

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/*/cart', '/*/profile', '/*/dashboard'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

export default robots
