import { Card, CardBody, CardHeader, Button } from '@heroui/react'

const AccountTab = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>จัดการกับบัญชีของฉัน</span>
      </CardHeader>
      <CardBody>
        <div className='flex w-1/2 flex-col'>
          <div className='border-divider rounded-t-lg border p-2.5'>
            <span>ข้อมูลส่วนตัว</span>
          </div>

          <div className='border-divider border-r border-b border-l p-2.5'>
            <div className='grid grid-cols-3'>
              <span>ชื่อ - นามสกุล</span>
              <span>:</span>
              <span>ธีรพัฒน์ แสงก่ำ</span>
            </div>

            <div className='grid grid-cols-3'>
              <span>อีเมล</span>
              <span>:</span>
              <span>kteeraphatt@gmail.com</span>
            </div>

            <div className='grid grid-cols-3'>
              <span>เบอร์มือถือ</span>
              <span>:</span>
              <span>0647070943</span>
            </div>

            <Button className='mt-5'>แก้ไขข้อมูลส่วนตัว</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { AccountTab }
