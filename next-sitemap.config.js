/** @type {import('next-sitemap').IConfig} */
const { getDynamicPaths } = require('./sitemap-generator')

const COUNTRY_CONFIG = {
  TH: { locale: 'th-TH' },
  US: { locale: 'en-US' },
  JP: { locale: 'ja-JP' },
  //CN: { locale: 'zh-CN' },
  //VN: { locale: 'vi-VN' },
}

module.exports = {
  siteUrl: process.env.APP_URL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: 'public',
  exclude: ['/[locale]', '/[locale]/*'],

  additionalPaths: async (config) => {
    const data = await getDynamicPaths()
    const allLangs = Object.keys(COUNTRY_CONFIG).map((c) => c.toLowerCase())

    return data.map((item) => {
      return {
        loc: `${config.siteUrl}/${item.lang}${item.relativeSlug}`,
        changefreq: 'weekly',
        priority: item.isHome ? 1.0 : 0.7,
        lastmod: new Date().toISOString(),
        alternateRefs: allLangs.map((l) => ({
          href: `${config.siteUrl}/${l}${item.relativeSlug}`,
          hreflang: COUNTRY_CONFIG[l.toUpperCase()].locale,
        })),
      }
    })
  },
}
