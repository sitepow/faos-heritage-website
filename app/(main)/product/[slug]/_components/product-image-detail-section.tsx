import { Card, CardBody } from '@heroui/card'

import { ProductImagePreview } from '@/app/(main)/_components/product/product-image-preview'
import { SocialShare } from '@/components/social-share'

const ProductImageDetailSection = () => {
  return (
    <Card className='col-span-2'>
      <CardBody>
        <div className='flex gap-5'>
          <ProductImagePreview
            images={[
              '/placeholder.svg',
              '/placeholder.svg',
              '/placeholder.svg',
              '/placeholder.svg',
              '/placeholder.svg',
              '/placeholder.svg',
            ]}
          />
          <div className='flex flex-col gap-4'>
            <span className='text-xl font-bold'>
              แอร์เคลื่อนที่ 18,000 BTU TCL รุ่น TAC-18CPA/NZ สีขาว
            </span>
            <span>
              บอกลาอากาศร้อนภายในห้อง ด้วยเครื่องปรับอากาศเคลื่อนที่ TCL รุ่น
              TAC-18CPA/NZ ขนาด 18,000 BTU มาพร้อมกับเทคโนโลยี 15s Instant
              Cooling ที่ให้ความเย็นเร็วทันใจภายใน 15 วินาที พร้อมด้วย 3
              ฟังก์ชันอัจฉริยะในเครื่องเดียว ทั้งทำความเย็น ลดความชื้น และเป่าลม
              อีกทั้งยังควบคุมง่ายได้ดั่งใจด้วยระบบ Two Way to Control
              ผ่านรีโมตคอนโทรล หรือหน้าจอระบบสัมผัส
              นอกจากนี้ยังเคลื่อนย้ายสะดวกสบายด้วยล้อเลื่อน 4 มุม
              และมีขนาดกะทัดรัด ทำให้จัดเก็บง่ายไม่เปลืองพื้นที่
              ตอบโจทย์ทุกการใช้ชีวิต ให้คุณเย็นสบายได้ตลอด 24 ชั่วโมง
            </span>
            <span className='text-default-500'>รหัสสินค้า: 60433147</span>
            <SocialShare />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export { ProductImageDetailSection }
