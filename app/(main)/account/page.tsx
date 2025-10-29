'use client'

import { Tab, Tabs } from '@heroui/tabs'

const Account = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <div className='w-full text-start'>
        <span className='text-xl font-bold'>บัญชีของคุณ ธีรพัฒน์ แสงก่ำ</span>
      </div>

      <Tabs isVertical aria-label='Options'>
        <Tab key='account' title='จัดการกับบัญชีของฉัน' />
        <Tab key='order' title='รายการคำสั่งซื้อของฉัน' />
        <Tab key='favorite' title='รายการโปรด' />
        <Tab key='profile' title='แก้ไขข้อมูลส่วนตัว' />
        <Tab key='address' title='จัดการที่อยู่ของฉัน' />
      </Tabs>
    </section>
  )
}

export default Account
