'use client'

import { Card, CardBody, Button } from '@heroui/react'
import { ArrowLeft, ClockIcon } from 'lucide-react'
import Link from 'next/link'

const AffiliateWaitingStatus = () => {
  return (
    <Card className='mx-auto max-w-2xl'>
      <CardBody className='flex flex-col items-center gap-6 py-10 text-center'>
        <div className='flex size-20 items-center justify-center rounded-full bg-amber-400/20 text-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]'>
          <ClockIcon size={40} />
        </div>

        <div className='space-y-2'>
          <h1 className='font-boldsm:text-3xl text-2xl'>
            ได้รับข้อมูลการสมัครแล้ว
          </h1>
          <p className='mx-auto max-w-3/4'>
            ขอบคุณที่สนใจร่วมเป็นพาร์ทเนอร์กับเรา
            ขณะนี้เจ้าหน้าที่กำลังตรวจสอบข้อมูลของท่าน กรุณารอการอนุมัติภายใน
            1-3 วันทำการ
          </p>
        </div>

        <div className='mx-auto flex w-1/2 flex-col gap-3 sm:flex-row'>
          <Button
            as={Link}
            className='flex-1 font-bold'
            href='/'
            startContent={<ArrowLeft size={18} />}
            variant='bordered'
          >
            กลับหน้าหลัก
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export { AffiliateWaitingStatus }
