import { siteConfig } from '@/config/site'

export const getFooter = () => {
  return ` Copyright ${new Date().getFullYear()} ${siteConfig.name} - ${siteConfig.title}`
}
