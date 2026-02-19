import { useMemo } from 'react'

import { PROFILE_TABS } from '@/constants'
import { useRouter } from '@/i18n/navigation'

const useAppNavigation = () => {
  const router = useRouter()

  const goTo = useMemo(() => {
    return {
      ACCOUNT: () => router.push(`/profile?tab=${PROFILE_TABS.ACCOUNT}`),
      ORDER: () => router.push(`/profile?tab=${PROFILE_TABS.ORDER}`),
      FAVORITE: () => router.push(`/profile?tab=${PROFILE_TABS.FAVORITE}`),
      PROFILE: () => router.push(`/profile?tab=${PROFILE_TABS.PROFILE}`),
      ADDRESS: () => router.push(`/profile?tab=${PROFILE_TABS.ADDRESS}`),
      DASHBOARD: () => router.push('/dashboard'),
      LOGIN: () => router.push('/login'),
      ABOUT: () => router.push('/about'),
      AFFILIATE: () => router.push('/affiliate'),
      REGISTER_AFFILIATE: () => router.push('/affiliate/register'),
      AFFILIATE_CONTRACT: () =>
        router.push('https://web.facebook.com/FAOShertitagefood'),
    }
  }, [router])

  return goTo
}

export { useAppNavigation }
