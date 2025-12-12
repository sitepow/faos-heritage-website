import { Button } from '@heroui/button'
import { ArrowRight, CheckCircleIcon } from 'lucide-react'

const ADVERTISE_MESSAGE = [
  'สามารถลงสินค้าได้สูงสุด 1,000 รายการ และไม่จำกัดจำนวนออเดอร์',
  'ทดลองใช้ฟรี 14 วันเต็ม ก่อนใช้งานจริง',
  'ปรับแต่งได้ตามความต้องการ ไม่ต้องเขียนโค้ด (แค่กระซิบบอกเราก็พอ)',
  'ปลอดภัยทุกการชำระเงิน ทั้งบัตรเครดิตและพร้อมเพย์',
  'ระบบหลังบ้านที่ช่วยให้บริหารจัดการได้ง่ายขึ้น',
  'ค่าบริการเพียง 990 บาท/เดือน (หลังหมดช่วงทดลอง)',
  'เว็บไซต์รวดเร็วด้วยเทคนิคการเพิ่มประสิทธิภาพพิเศษ',
  'พัฒนาด้วยเทคโนโลยีทันสมัยและโค้ดคุณภาพระดับ Production',
  'รองรับการใช้งานบนมือถือและทุกอุปกรณ์ (Responsive Design)',
  'บริการดูแลและอัพเดทระบบอย่างต่อเนื่อง',
  'รองรับทั้งสินค้าไฟล์ดิจิทัลและสินค้าจริง',
]

const AdvertiseItem = ({ message }: { message: string }) => {
  return (
    <div className='flex items-start gap-2 text-start'>
      <CheckCircleIcon className='mt-0.5 size-5 shrink-0' />
      <span className='leading-relaxed'>{message}</span>
    </div>
  )
}

const BannerAdvertise = () => {
  return (
    <div className='flex w-full flex-col gap-6 rounded-xl bg-primary-website p-6 text-white shadow-xl'>
      <h2 className='mx-auto max-w-11/12 text-center text-2xl leading-tight font-bold sm:max-w-10/12 md:max-w-1/2 xl:max-w-1/3'>
        ทำไมต้องเลือกใช้ซอฟต์แวร์ ZentraCore
        ในการเปิดร้านค้าออนไลน์เป็นของตัวเอง?
      </h2>

      <div className='mx-auto grid gap-2 xl:grid-cols-2'>
        {ADVERTISE_MESSAGE.map((advertise) => (
          <AdvertiseItem key={advertise} message={advertise} />
        ))}
      </div>

      <div className='flex flex-wrap justify-center gap-2'>
        <Button variant='faded'>ดูข้อเสนอทั้งหมด</Button>
        <Button
          endContent={<ArrowRight className='text-default-500' />}
          variant='faded'
        >
          ทดลองใช้งาน ZentraCore ฟรี
        </Button>
      </div>
    </div>
  )
}

export { BannerAdvertise }
