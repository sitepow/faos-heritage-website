'use client'

import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from '@heroui/react'
import { CopyIcon, HeartIcon, ShoppingCartIcon } from 'lucide-react'

import { ProductImagePreview } from '../../_components/product/product-image-preview'

import { PriceRange } from '@/components/price-range'
import { SocialShare } from '@/components/social-share'
import { StockInput } from '@/components/stock-input'

const Product = () => {
  return (
    <section className='flex flex-col justify-center gap-4 text-center'>
      <Breadcrumbs className='font-bold'>
        <BreadcrumbItem>หน้าหลัก</BreadcrumbItem>
        <BreadcrumbItem>เครื่องใช้ไฟฟ้า</BreadcrumbItem>
      </Breadcrumbs>

      <div className='grid grid-cols-3 gap-4'>
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
                  บอกลาอากาศร้อนภายในห้อง ด้วยเครื่องปรับอากาศเคลื่อนที่ TCL
                  รุ่น TAC-18CPA/NZ ขนาด 18,000 BTU มาพร้อมกับเทคโนโลยี 15s
                  Instant Cooling ที่ให้ความเย็นเร็วทันใจภายใน 15 วินาที
                  พร้อมด้วย 3 ฟังก์ชันอัจฉริยะในเครื่องเดียว ทั้งทำความเย็น
                  ลดความชื้น และเป่าลม อีกทั้งยังควบคุมง่ายได้ดั่งใจด้วยระบบ Two
                  Way to Control ผ่านรีโมตคอนโทรล หรือหน้าจอระบบสัมผัส
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

        <Card>
          <CardHeader className='flex flex-col items-start gap-4'>
            <PriceRange price={250} />

            <div className='flex w-full gap-4'>
              <StockInput />

              <Button fullWidth startContent={<ShoppingCartIcon />}>
                ใส่ตระกร้า
              </Button>
            </div>
          </CardHeader>

          <CardBody className='gap-4'>
            <Divider />
            <div className='flex justify-center gap-4'>
              <div className='flex cursor-pointer gap-2'>
                <HeartIcon />
                <span>รายการโปรด</span>
              </div>

              <div className='flex cursor-pointer gap-2'>
                <CopyIcon />
                <span>เปรียบเทียบ</span>
              </div>
            </div>
            <Divider />
          </CardBody>
        </Card>
      </div>
    </section>
  )
}

export default Product
