import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Button,
  Divider,
} from '@heroui/react'

const ProfileTab = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>แก้ไขข้อมูลส่วนตัว</span>
      </CardHeader>
      <CardBody>
        <div className='grid grid-cols-2 gap-5'>
          <Input label='ชื่อ' size='sm' />
          <Input label='อีเมล' size='sm' />
          <Input label='หมายเลขโทรศัพท์มือถือ' size='sm' />
        </div>
      </CardBody>

      <Divider />

      <CardFooter className='gap-4'>
        <Button>บันทึกข้อมูล</Button>
        <Button>ยกเลิก</Button>
      </CardFooter>
    </Card>
  )
}

export { ProfileTab }
