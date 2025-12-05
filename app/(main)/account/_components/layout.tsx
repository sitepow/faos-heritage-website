'use client'

import { Tab, Tabs } from '@heroui/tabs'
import { useEffect, useState } from 'react'

import { useIsLg } from '@/hooks/useBreakpoints'
import { useQueryParams } from '@/hooks/useQueryParams'
import { ACCOUNT_TABS } from '@/utils/const'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { AccountCard } from './card/account'
import { AddressCard } from './card/address'
import { FavoriteCard } from './card/favorite'
import { OrderCard } from './card/order'
import { ProfileCard } from './card/profile'

const AccountLayout = () => {
  const { data: session } = useSession()
  const user = session?.user
  const isLg = useIsLg()
  const { setQueryParam, getQueryParam } = useQueryParams()

  const tabParam = getQueryParam('tab') as ACCOUNT_TABS | null
  const [selectedTabKey, setSelectedTabKey] = useState<ACCOUNT_TABS>(
    tabParam ?? ACCOUNT_TABS.ACCOUNT,
  )

  useEffect(() => {
    if (tabParam && tabParam !== selectedTabKey) {
      setSelectedTabKey(tabParam)
    }
  }, [selectedTabKey, tabParam])

  const handleTabChange = (key: React.Key) => {
    const tabKey = key as ACCOUNT_TABS

    setSelectedTabKey(tabKey)
    setQueryParam('tab', tabKey)
  }

  return (
    <>
      <Head>
        <meta name='robots' content='noindex, nofollow' />
      </Head>

      <section className='flex flex-col items-center justify-center gap-4 text-center'>
        <div className='w-full text-start'>
          <span className='text-xl font-bold'>บัญชีของคุณ {user?.name}</span>
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
            <Tab key={ACCOUNT_TABS.ACCOUNT} title='จัดการกับบัญชีของฉัน'>
              <AccountCard onclick={() => handleTabChange(ACCOUNT_TABS.PROFILE)} />
            </Tab>
            <Tab key={ACCOUNT_TABS.ORDER} title='รายการคำสั่งซื้อของฉัน'>
              <OrderCard />
            </Tab>
            <Tab key={ACCOUNT_TABS.FAVORITE} title='รายการโปรด'>
              <FavoriteCard />
            </Tab>
            <Tab key={ACCOUNT_TABS.PROFILE} title='แก้ไขข้อมูลส่วนตัว'>
              <ProfileCard />
            </Tab>
            <Tab key={ACCOUNT_TABS.ADDRESS} title='จัดการที่อยู่ของฉัน'>
              <AddressCard />
            </Tab>
          </Tabs>
        </div>
      </section>
    </>
  )
}

export { AccountLayout }
