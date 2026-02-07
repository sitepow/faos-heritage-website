'use client'

import { Alert } from '@heroui/react'
import { useTheme } from 'next-themes'
import { Suspense, type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'

import { HeroUIProviders } from './HeroUI'
import { NextAuthProviders } from './NextAuth'
import { QueryProviders } from './QueryClient'

const Providers = ({ children }: PropsWithChildren) => {
  const { theme } = useTheme()

  return (
    <Suspense>
      <QueryProviders>
        <NextAuthProviders>
          <HeroUIProviders
            themeProps={{
              attribute: 'class',
              defaultTheme: 'system',
              enableSystem: true,
            }}
          >
            <ToastContainer
              closeOnClick
              hideProgressBar
              stacked
              autoClose={3000}
              closeButton={false}
              theme={theme === 'dark' ? 'dark' : 'light'}
            />
            {/* <Alert
              color='warning'
              description='ขออภัยในความไม่สะดวกครับ ขณะนี้เว็บไซต์ของเรากำลังอยู่ระหว่างปรับปรุงระบบเพื่อให้ใช้งานได้ดียิ่งขึ้น ซึ่งอาจใช้เวลาสักระยะครับ
                    **ทำให้ระบบสั่งซื้อบนเว็บไซต์และระบบจัดการข้อมูลเข้าใช้งานไม่ได้ชั่วคราว** คุณลูกค้ายังสามารถสั่งซื้อได้ตามปกติผ่านช่องทาง: Facebook: [https://web.facebook.com/FAOShertitagefood] Shopee: [https://shopee.co.th/ptatom?categoryId=100629&entryPoint=ShopByPDP&itemId=56204803689&upstream=search] หน้าร้าน: [ฟู้ดแลนด์]'
              title='ประกาศปรับปรุงระบบชั่วคราว'
            /> */}

            <Alert
              color='warning'
              description={
                <span>
                  ขออภัยในความไม่สะดวกครับ
                  ขณะนี้เว็บไซต์ของเรากำลังอยู่ระหว่างปรับปรุงระบบเพื่อให้ใช้งานได้ดียิ่งขึ้น
                  ซึ่งอาจใช้เวลาสักระยะครับ
                  **ทำให้ระบบสั่งซื้อและจัดการข้อมูลใช้งานไม่ได้**
                  แต่ท่านยังสั่งซื้อได้ตามปกติผ่าน:
                  [Facebook](https://web.facebook.com/FAOShertitagefood),
                  [Shopee](https://shopee.co.th/ptatom) หรือที่หน้าร้าน
                  **ฟู้ดแลนด์**
                </span>
              }
              title='ประกาศปรับปรุงระบบชั่วคราว'
            />

            {children}
          </HeroUIProviders>
        </NextAuthProviders>
      </QueryProviders>
    </Suspense>
  )
}

export { Providers }
