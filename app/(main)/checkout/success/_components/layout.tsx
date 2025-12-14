'use client'

import { CheckCircle2Icon } from 'lucide-react'

import { useQueryParams } from '@/hooks/useQueryParams'

const SuccessLayout = () => {
  const { getQueryParam } = useQueryParams()
  const orderId = getQueryParam('orderId')

  return (
    <section className='flex flex-col items-center justify-center gap-3 text-center'>
      <div className='flex flex-col items-center gap-4'>
        <CheckCircle2Icon className='size-10 text-teal-600' />
        <h1 className='text-2xl'>ชำระเงินสำเร็จ</h1>
      </div>

      <span className='text-default-500 sm:w-4/5 lg:w-1/2'>
        ขอบคุณสำหรับการสั่งซื้อกับทางเรา
        ระบบได้ทำการตรวจสอบและยืนยันการชำระเงินของคุณเรียบร้อยแล้ว
        {orderId && (
          <>
            {' '}
            โดยคำสั่งซื้อนี้มีหมายเลขอ้างอิงคือ{' '}
            <span className='text-primary-website underline'>
              {orderId}
            </span>{' '}
            กรุณาเก็บหมายเลขคำสั่งซื้อนี้ไว้สำหรับการตรวจสอบสถานะหรือการติดต่อฝ่ายบริการลูกค้าในภายหลัง
          </>
        )}
      </span>
    </section>
  )
}

export { SuccessLayout }
