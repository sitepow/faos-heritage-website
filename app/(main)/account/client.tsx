'use client'

import { Tab, Tabs } from '@heroui/react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import type { Key } from 'react'

import { AddressCard } from '@/app/(main)/account/components/address/card'
import { FavoriteCard } from '@/app/(main)/account/components/favorite/card'
import { OrderCard } from '@/app/(main)/account/components/order/card'
import { OverviewCard } from '@/app/(main)/account/components/overview-card'
import { ProfileCard } from '@/app/(main)/account/components/profile-card'
import { ACCOUNT_TAB } from '@/features'
import { useQueryParams } from '@/hooks/useQueryParams'

export const AccountClient = () => {
  const { data: session } = useSession()
  const user = session?.user
  const { setQueryParam, getQueryParam } = useQueryParams()

  const tabParam = getQueryParam('tab') as ACCOUNT_TAB | null
  const [selectedTabKey, setSelectedTabKey] = useState<ACCOUNT_TAB>(
    tabParam ?? ACCOUNT_TAB.ACCOUNT,
  )

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
          <span className='text-xl font-bold'>Your account {user?.name}</span>
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
              isVertical
              selectedKey={selectedTabKey}
              variant='bordered'
              onSelectionChange={handleTabChange}
            >
              <Tab key={ACCOUNT_TAB.ACCOUNT} title='Manage my account'>
                <OverviewCard
                  onclick={() => handleTabChange(ACCOUNT_TAB.PROFILE)}
                />
              </Tab>
              <Tab key={ACCOUNT_TAB.ORDER} title='My Orders'>
                <OrderCard />
              </Tab>
              <Tab key={ACCOUNT_TAB.FAVORITE} title='Favorites'>
                <FavoriteCard />
              </Tab>
              <Tab key={ACCOUNT_TAB.PROFILE} title='Edit personal information'>
                <ProfileCard />
              </Tab>
              <Tab key={ACCOUNT_TAB.ADDRESS} title='Manage my address'>
                <AddressCard />
              </Tab>
            </Tabs>
          )}
        </div>
      </section>
    </>
  )
}
