import { Card, CardBody, CardHeader } from '@heroui/card'
import { Divider } from '@heroui/divider'

const DetailCard = () => {
  return (
    <Card className='col-span-2' shadow='none'>
      <CardHeader className='flex-col items-start gap-4'>
        <span>รายละเอียด</span>
        <Divider />
      </CardHeader>
      <CardBody className='pl-10'>
        <ul className='list-disc'>
          <li>
            QD-MINI LED จาก TCL ขนาด 65 นิ้ว มาพร้อมหน้าจอความละเอียดระดับ 4K
            (3,840 x 2,160)
          </li>
          <li>
            ดีไซน์ Ultra Slim บางเฉียบอย่างไร้รอยต่อ
            สามารถติดผนังได้อย่างกลมกลืน ราวกับงานศิลปะชิ้นเอก
          </li>
          <li>หมายเหตุ</li>
          <li>
            ราคาที่จำหน่ายเฉพาะตัวเครื่องทีวี ไม่รวมค่าบริการปรับจูนสัญญาณทีวี
            และค่าติดตั้งขาแขวนทีวี (ในส่วนของค่าบริการปรับจูนสัญญาณทีวี
            และค่าติดตั้งขาแขวนทีวี กรุณาติดต่อสอบถามแผนกบริการหลังการขาย
            เบอร์โทร 1308) สีของผลิตภัณฑ์ที่แสดงบนเว็บไซต์
            อาจมีความแตกต่างกันจากการตั้งค่าการแสดงผลสีของแต่ละหน้าจอ
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}

export { DetailCard }
