import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from '@heroui/react'

const ProfileCard = () => {
  return (
    <Card fullWidth>
      <CardHeader>
        <span>แก้ไขข้อมูลส่วนตัว</span>
      </CardHeader>
      <CardBody>
        <div className='grid gap-5 lg:grid-cols-2'>
          <Input label='ชื่อ' size='sm' />
          <Input label='อีเมล' size='sm' />
          <Input label='หมายเลขโทรศัพท์มือถือ' size='sm' />
        </div>
      </CardBody>
      <Divider />
      <CardFooter className='mx-auto gap-2'>
        <Button>บันทึกข้อมูล</Button>
        <Button>ยกเลิก</Button>
      </CardFooter>
    </Card>
  )
}

export { ProfileCard }
