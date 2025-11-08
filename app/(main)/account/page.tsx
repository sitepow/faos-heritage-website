'use client'

import { Tab, Tabs } from '@heroui/react'
import { useState } from 'react'

import { AccountTab } from '../_components/account/account-tab'
import { AddressTab } from '../_components/account/address-tab'
import { FavoriteTab } from '../_components/account/favorite-tab'
import { OrderTab } from '../_components/account/order-tab'
import { ProfileTab } from '../_components/account/profile-tab'

const Account = () => {
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
          isVertical
          aria-label='Options'
          className='h-full rounded-lg light:bg-white'
          classNames={{
            panel: 'w-full',
          }}
          selectedKey={selectedTabKey}
          variant='bordered'
          onSelectionChange={setSelectedTabKey}
        >
          <Tab key='account' title='จัดการกับบัญชีของฉัน'>
            <AccountTab onclick={() => setSelectedTabKey('profile')} />
          </Tab>
          <Tab key='order' title='รายการคำสั่งซื้อของฉัน'>
            <OrderTab />
          </Tab>
          <Tab key='favorite' title='รายการโปรด'>
            <FavoriteTab />
          </Tab>
          <Tab key='profile' title='แก้ไขข้อมูลส่วนตัว'>
            <ProfileTab />
          </Tab>
          <Tab key='address' title='จัดการที่อยู่ของฉัน'>
            <AddressTab />
          </Tab>
        </Tabs>
      </div>
    </section>
  )
}

export default Account
