import { Button } from '@heroui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'

const ProfileCard = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>แก้ไขข้อมูลส่วนตัว</span>
      </CardHeader>
      <CardBody>
        <div className='grid gap-5 lg:grid-cols-2 xl:grid-cols-3'>
          <Input label='ชื่อ' size='sm' />
          <Input label='อีเมล' size='sm' />
          <Input label='หมายเลขโทรศัพท์มือถือ' size='sm' />
        </div>
      </CardBody>
      <CardFooter className='gap-2'>
        <Button variant='faded'>ยกเลิก</Button>
        <Button isDisabled variant='faded'>
          บันทึกข้อมูล
        </Button>
      </CardFooter>
    </Card>
  )
}

export { ProfileCard }
