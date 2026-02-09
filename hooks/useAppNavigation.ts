import { useRouter } from 'next/navigation'

import { PROFILE_TABS } from '@/constants'

const useAppNavigation = () => {
  const router = useRouter()

  const goTo = {
    ACCOUNT: () => router.push(`/profile?tab=${PROFILE_TABS.ACCOUNT}`),
    ORDER: () => router.push(`/profile?tab=${PROFILE_TABS.ORDER}`),
    FAVORITE: () => router.push(`/profile?tab=${PROFILE_TABS.FAVORITE}`),
    PROFILE: () => router.push(`/profile?tab=${PROFILE_TABS.PROFILE}`),
    ADDRESS: () => router.push(`/profile?tab=${PROFILE_TABS.ADDRESS}`),
    DASHBOARD: () => router.push('/dashboard'),
    LOGIN: () => router.push('/login'),
  }

  return goTo
}

export { useAppNavigation }
