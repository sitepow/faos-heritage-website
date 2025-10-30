'use client'

import { Tab, Tabs } from '@heroui/tabs'

import { AccountTab } from './components/account-tab'
import { AddressTab } from './components/address-tab'
import { FavoriteTab } from './components/favorite-tab'
import { OrderTab } from './components/order-tab'
import { ProfileTab } from './components/profile-tab'

const Account = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='w-full text-start'>
        <span className='text-xl font-bold'>บัญชีของคุณ ธีรพัฒน์ แสงก่ำ</span>
      </div>

      <div className='w-full'>
        <Tabs isVertical aria-label='Options' variant='bordered'>
          <Tab key='account' title='จัดการกับบัญชีของฉัน'>
            <AccountTab />
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
