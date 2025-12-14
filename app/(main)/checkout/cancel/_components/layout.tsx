'use client'

import { XCircleIcon } from 'lucide-react'

import { useQueryParams } from '@/hooks/useQueryParams'

const CancelLayout = () => {
  const { getQueryParam } = useQueryParams()
  const orderId = getQueryParam('orderId')

  return (
    <section className='flex flex-col items-center justify-center gap-3 text-center'>
      <div className='flex flex-col items-center gap-4'>
        <XCircleIcon className='size-10 text-danger' />
        <h1 className='text-2xl'>ยกเลิกการชำระเงิน</h1>
      </div>

      <span className='text-default-500 sm:w-4/5 lg:w-1/2'>
        รายการชำระเงินของคุณยังไม่สำเร็จ หรือถูกยกเลิกก่อนดำเนินการเสร็จสมบูรณ์
        ระบบยังไม่ได้ทำการเรียกเก็บเงินจากคุณ
        {orderId && (
          <>
            {' '}
            โดยคำสั่งซื้อนี้มีหมายเลขอ้างอิงคือ{' '}
            <span className='text-primary-website underline'>
              {orderId}
            </span>{' '}
            หากต้องการดำเนินการสั่งซื้อใหม่ สามารถกลับไปทำรายการอีกครั้งได้ทันที
            หรือใช้หมายเลขนี้ในการติดต่อฝ่ายบริการลูกค้า
          </>
        )}
      </span>
    </section>
  )
}

export { CancelLayout }
