import { useTranslations } from 'next-intl'

import { NAV_PATH_MAP } from '@/constants/navigation'

const useStaticNavLinks = () => {
  const t = useTranslations('navigation.navbar')
  const rawLinks = t.raw('links') as Record<string, string>

  const staticLinks = Object.entries(rawLinks).map(([key, label]) => ({
    key,
    label,
    href: NAV_PATH_MAP[key] || '/',
  }))

  return { staticLinks }
}

export { useStaticNavLinks }
