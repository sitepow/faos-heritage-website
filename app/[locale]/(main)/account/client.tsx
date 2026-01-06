'use client'

import { Tab, Tabs } from '@heroui/react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import type { Key } from 'react'

import {
  OverviewCard,
  OrderCard,
  FavoriteCard,
  ProfileCard,
  AddressCard,
} from './_components'

import { useIsBelowBreakpoint } from '@/hooks/useIsBelowBreakpoint'
import { useMounted } from '@/hooks/useMounted'
import { useQueryParams } from '@/hooks/useQueryParams'
import { IS_TABLET_OR_MOBILE } from '@/utils/constants'
import { ACCOUNT_TAB } from '@/utils/features'

export const AccountClient = () => {
  const t = useTranslations('Account')
  const isTabletOrMobile = useIsBelowBreakpoint(IS_TABLET_OR_MOBILE)
  const mounted = useMounted()

  const { data: session } = useSession()
  const user = session?.user
  const { setQueryParam, getQueryParam } = useQueryParams()

  const tabParam = getQueryParam('tab') as ACCOUNT_TAB | null
  const [selectedTabKey, setSelectedTabKey] = useState<ACCOUNT_TAB>(
    tabParam ?? ACCOUNT_TAB.ACCOUNT,
  )

  useEffect(() => {
    if (tabParam && tabParam !== selectedTabKey) {
      setSelectedTabKey(tabParam)
    }
  }, [selectedTabKey, tabParam])

  const handleTabChange = (key: Key) => {
    const tab = key as ACCOUNT_TAB

    setSelectedTabKey(tab)
    setQueryParam('tab', tab)
  }

  return (
    <>
      <Head>
        <meta content='noindex, nofollow' name='robots' />
      </Head>

      <section className='flex flex-col items-center justify-center gap-4 text-center'>
        <div className='w-full text-start'>
          <span className='text-xl font-bold'>
            {t('welcome', { name: user?.name! })}
          </span>
        </div>

        <div className='w-full'>
          {mounted && (
            <Tabs
              aria-label='Options'
              className='light:bg-white h-full rounded-lg'
              classNames={{
                base: 'w-full flex flex-col lg:flex-row lg:w-fit',
                tabList: 'flex overflow-x-auto lg:flex-col lg:w-fit gap-1 p-2',
                panel: `w-full`,
              }}
              isVertical={isTabletOrMobile ? true : false}
              selectedKey={selectedTabKey}
              variant='bordered'
              onSelectionChange={handleTabChange}
            >
              <Tab key={ACCOUNT_TAB.ACCOUNT} title={t('tabs.manage')}>
                <OverviewCard
                  onclickProfile={() => handleTabChange(ACCOUNT_TAB.PROFILE)}
                  onclickAddress={() => handleTabChange(ACCOUNT_TAB.ADDRESS)}
                />
              </Tab>
              <Tab key={ACCOUNT_TAB.ORDER} title={t('tabs.orders')}>
                <OrderCard />
              </Tab>
              <Tab key={ACCOUNT_TAB.FAVORITE} title={t('tabs.favorites')}>
                <FavoriteCard />
              </Tab>
              <Tab key={ACCOUNT_TAB.PROFILE} title={t('tabs.editProfile')}>
                <ProfileCard />
              </Tab>
              <Tab key={ACCOUNT_TAB.ADDRESS} title={t('tabs.address')}>
                <AddressCard />
              </Tab>
            </Tabs>
          )}
        </div>
      </section>
    </>
  )
}
