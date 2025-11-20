'use client'

import { Tab, Tabs } from '@heroui/react'
import { useState } from 'react'

import { AccountCard } from './_components/card/account'
import { AddressCard } from './_components/card/address'
import { FavoriteCard } from './_components/card/favorite'
import { OrderCard } from './_components/card/order'
import { ProfileCard } from './_components/card/profile'

import { useIsLg } from '@/hooks/useBreakpoints'

const Account = () => {
  const isLg = useIsLg()
  const [selectedTabKey, setSelectedTabKey] = useState<string | number>(
    'account',
  )

  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='w-full text-start'>
        <span className='text-xl font-bold'>บัญชีของคุณ ธีรพัฒน์ แสงก่ำ</span>
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
          onSelectionChange={setSelectedTabKey}
        >
          <Tab key='account' title='จัดการกับบัญชีของฉัน'>
            <AccountCard onclick={() => setSelectedTabKey('profile')} />
          </Tab>
          <Tab key='order' title='รายการคำสั่งซื้อของฉัน'>
            <OrderCard />
          </Tab>
          <Tab key='favorite' title='รายการโปรด'>
            <FavoriteCard />
          </Tab>
          <Tab key='profile' title='แก้ไขข้อมูลส่วนตัว'>
            <ProfileCard />
          </Tab>
          <Tab key='address' title='จัดการที่อยู่ของฉัน'>
            <AddressCard />
          </Tab>
        </Tabs>
      </div>
    </section>
  )
}

export default Account
