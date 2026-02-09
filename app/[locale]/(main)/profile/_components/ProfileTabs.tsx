'use client'

import { Tab, Tabs } from '@heroui/react'
import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'

import { AccountCard } from './AccountCard'

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

  const tabStyles = useMemo(
    () => ({
      base: 'w-full flex flex-col lg:flex-row lg:w-fit',
      tabList: 'flex overflow-x-auto lg:flex-col lg:w-[240px] p-2',
      panel: 'w-full',
    }),
    [],
  )

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
      return <div />
    case PROFILE_TABS.FAVORITE:
      return <div />
    case PROFILE_TABS.PROFILE:
      return <div />
    case PROFILE_TABS.ADDRESS:
      return <div />
    default:
      return null
  }
}

export { ProfileTabs }
