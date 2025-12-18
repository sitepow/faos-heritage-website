'use client'

import { Tab, Tabs } from '@heroui/tabs'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { AddressCard } from '@/app/(main)/_components/card/account/address'
import { FavoriteCard } from '@/app/(main)/_components/card/account/favorite'
import { OrderCard } from '@/app/(main)/_components/card/account/order'
import { OverviewCard } from '@/app/(main)/_components/card/account/overview'
import { ProfileCard } from '@/app/(main)/_components/card/account/profile'
import { useIsLg } from '@/hooks/useBreakpoints'
import { useQueryParams } from '@/hooks/useQueryParams'
import { ACCOUNT_TAB } from '@/utils/const'

const AccountClient = () => {
  const { data: session } = useSession()
  const user = session?.user
  const isLg = useIsLg()
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

  const handleTabChange = (key: React.Key) => {
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
          <Tabs
            aria-label='Options'
            className='h-full rounded-lg light:bg-white'
            classNames={{
              base: 'w-full flex flex-col lg:flex-row lg:w-fit',
              tabList: 'flex overflow-x-auto lg:flex-col lg:w-fit gap-1 p-2',
              panel: `w-full`,
            }}
            isVertical={isLg ? true : false}
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
        </div>
      </section>
    </>
  )
}

export { AccountClient }
