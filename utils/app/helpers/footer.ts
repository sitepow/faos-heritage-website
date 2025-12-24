import { siteConfig } from '@/config/site'

export const getFooter = () =>
  `Copyright ${new Date().getFullYear()} ${
    siteConfig.name
  } - ${siteConfig.title}`
