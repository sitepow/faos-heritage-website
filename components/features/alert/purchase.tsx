'use client'

import { Alert } from '@heroui/react'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

import { PURCHASE_ALERT_COOKIE } from '@/utils/constants/cookie'

export const PurchaseAlert = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = Cookies.get(PURCHASE_ALERT_COOKIE)
    if (!dismissed) {
      setVisible(true)
    }
  }, [])

  if (!visible) {
    return null
  }

  const onClose = () => {
    Cookies.set(PURCHASE_ALERT_COOKIE, 'true', {
      expires: 1,
      sameSite: 'lax',
    })
    setVisible(false)
  }

  return (
    <div
      onClick={onClose}
      className='border-divider fixed top-16 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 cursor-pointer border backdrop-blur-md dark:bg-black/80'
    >
      <Alert
        color='warning'
        className='flex-wrap justify-center gap-2 shadow-2xl sm:flex-nowrap sm:justify-start'
        variant='flat'
        radius='none'
      >
        <div className='flex flex-col gap-1'>
          {/* <p className='font-semibold'>The website is now open for orders</p> */}
          <p className='text-sm opacity-80'>
            {/* We are continuously improving and adding new features. If you
            encounter any issues or have suggestions, please feel free to let us
            know. ({formatDate(new Date())}) */}
            We are updating our payment system. Sorry for the inconvenience.
            Orders will be available again on Sat Dec 27 2025 15:06:40 GMT+0700
            (Indochina Time).
          </p>
        </div>
      </Alert>
    </div>
  )
}
