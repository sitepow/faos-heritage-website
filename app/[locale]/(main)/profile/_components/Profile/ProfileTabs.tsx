'use client'

import { Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'
import React from 'react'

import { ProfileCard } from './ProfileCard'
import { AccountCard } from '../AccountCard'
import { tabStyles } from './Profile.styles'
import { AddressCard } from '../Address/AddressCard'
import { FavoriteCard } from '../Favorite/FavoriteCard'
import { OrderCard } from '../Order/OrderCard'

import { BREAKPOINTS, PROFILE_TABS } from '@/constants'
import { useIsBelowBreakpoint } from '@/hooks/useIsBelowBreakpoint'
import { useIsMounted } from '@/hooks/useIsMounted'
import { useUrlQuery } from '@/hooks/useUrlQuery'

const TAB_CONFIG = [
  { id: PROFILE_TABS.ACCOUNT, key: 'sections.basic' },
  { id: PROFILE_TABS.ORDER, key: 'tabs.orders' },
  { id: PROFILE_TABS.FAVORITE, key: 'tabs.favs' },
  { id: PROFILE_TABS.PROFILE, key: 'tabs.edit' },
  { id: PROFILE_TABS.ADDRESS, key: 'sections.address' },
]

const ProfileTabs = () => {
  const t = useTranslations('profile')
  const isMounted = useIsMounted()
  const isMobile = useIsBelowBreakpoint(BREAKPOINTS.TABLET)
  const { setQueryParam, getQueryParam } = useUrlQuery()

  const activeTab =
    (getQueryParam('tab') as PROFILE_TABS) || PROFILE_TABS.ACCOUNT

  const onTabChange = (key: React.Key) => {
    setQueryParam('tab', key.toString())
  }

  if (!isMounted) {
    return
  }

  return (
    <Tabs
      classNames={tabStyles}
      isVertical={!isMobile}
      selectedKey={activeTab}
      variant='bordered'
      onSelectionChange={onTabChange}
    >
      {TAB_CONFIG.map((tab) => (
        <Tab key={tab.id} title={t(tab.key)}>
          {renderTabContent(tab.id)}
        </Tab>
      ))}
    </Tabs>
  )
}

const renderTabContent = (tab: PROFILE_TABS) => {
  switch (tab) {
    case PROFILE_TABS.ACCOUNT:
      return <AccountCard />
    case PROFILE_TABS.ORDER:
      return <OrderCard />
    case PROFILE_TABS.FAVORITE:
      return <FavoriteCard />
    case PROFILE_TABS.PROFILE:
      return <ProfileCard />
    case PROFILE_TABS.ADDRESS:
      return <AddressCard />
    default:
      return null
  }
}

export { ProfileTabs }
