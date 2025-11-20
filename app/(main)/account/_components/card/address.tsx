import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { MapPinIcon } from 'lucide-react'

const AddressCard = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>จัดการที่อยู่ของฉัน</span>
      </CardHeader>
      <CardBody>
        <div className='flex flex-col lg:w-1/2'>
          <div className='rounded-t-lg border border-divider p-2.5'>
            <span>ที่อยู่ที่จัดส่ง</span>
          </div>

          <div className='flex flex-col gap-5 border-r border-b border-l border-divider p-2.5'>
            <div className='flex flex-wrap items-center gap-4'>
              <MapPinIcon className='shrink-0' />
              <span>
                117/2 หมู่บ้าน/อาคาร ศุภราช หมู่ที่1, ตำบล/แขวง บางปู,
                เกาะจันทร์, ชลบุรี 20240
              </span>
            </div>

            <Button className='w-fit'>แก้ไขที่อยู่</Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { AddressCard }
