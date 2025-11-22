import { Button, Card, CardBody, CardHeader } from '@heroui/react'

import type { FC } from 'react'

interface Props {
  onclick?: () => void
}

const AccountCard: FC<Props> = ({ onclick }) => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>จัดการกับบัญชีของฉัน</span>
      </CardHeader>
      <CardBody>
        <div className='flex flex-col lg:w-1/2'>
          <div className='rounded-t-lg border border-divider p-2.5'>
            <span>ข้อมูลส่วนตัว</span>
          </div>

          <div className='rounded-b-lg border-x border-b border-divider p-2.5 *:flex *:gap-3'>
            <div>
              <span>ชื่อ - นามสกุล</span>
              <span>:</span>
              <span>ธีรพัฒน์ แสงก่ำ</span>
            </div>

            <div>
              <span>อีเมล</span>
              <span>:</span>
              <span>kteeraphatt@gmail.com</span>
            </div>

            <div>
              <span>เบอร์มือถือ</span>
              <span>:</span>
              <span>0647070943</span>
            </div>

            <Button className='mt-5' variant='faded' onPress={onclick}>
              แก้ไขข้อมูลส่วนตัว
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { AccountCard }
