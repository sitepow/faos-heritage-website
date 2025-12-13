'use client'

import { Accordion, AccordionItem } from '@heroui/accordion'

import { Header } from '../_components/section/header'

const Payment = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <Header
        description='แสดงวิธีและช่องทางการชำระเงินที่รองรับ'
        title='วิธีการชำระเงิน'
      />

      <div className='mx-auto lg:w-1/2'>
        <Accordion variant='splitted'>
          <AccordionItem
            key='1'
            aria-label='วิธีการเริ่มซื้อสินค้า'
            title='วิธีการเริ่มซื้อสินค้า'
          >
            <div className='space-y-3 text-left'>
              <p>
                1. เลือกสินค้าที่ต้องการแล้วกด{' '}
                <strong className='text-primary-website'>
                  “เพิ่มลงตะกร้า”
                </strong>
              </p>
              <p>2. เปิดตะกร้าสินค้าเพื่อตรวจสอบรายการ</p>
              <p>
                3. เมื่อพร้อมชำระเงิน กดปุ่ม{' '}
                <strong className='text-primary-website'>
                  “สั่งซื้อสินค้า”
                </strong>
              </p>
              <p>4. ระบบจะพาคุณไปยังหน้าชำระเงินที่มีความปลอดภัยของ Stripe</p>
            </div>
          </AccordionItem>

          <AccordionItem
            key='2'
            aria-label='วิธีการชำระเงินด้วยบัตรเดบิต/เครดิต'
            title='วิธีการชำระเงินด้วยบัตรเดบิต/เครดิต'
          >
            <div className='space-y-3 text-left'>
              <p>
                ระบบรองรับบัตรเดบิตและเครดิตทุกธนาคารที่มีสัญลักษณ์
                <strong className='text-primary-website'>
                  {' '}
                  Visa, Mastercard, JCB
                </strong>{' '}
                และบัตรเสมือนของธนาคารต่าง ๆ
              </p>
              <p>ขั้นตอน:</p>
              <ul className='list-disc space-y-2 pl-5'>
                <li>กรอกหมายเลขบัตร วันหมดอายุ และ CVC ตามที่แสดงบนบัตร</li>
                <li>ยืนยันตัวตนผ่าน OTP หากธนาคารของคุณกำหนด</li>
                <li>หลังชำระเงินสำเร็จ ระบบจะส่งอีเมลยืนยันอัตโนมัติ</li>
              </ul>
              <p className='text-default-500'>
                ข้อมูลบัตรของคุณถูกเข้ารหัสและจัดการโดย Stripe โดยตรง
                ทางเราไม่สามารถเข้าถึงข้อมูลบัตรของคุณได้
              </p>
            </div>
          </AccordionItem>

          <AccordionItem
            key='3'
            aria-label='วิธีการชำระเงินด้วย QR Code'
            title='วิธีการชำระเงินด้วย QR Code'
          >
            <div className='space-y-3 text-left'>
              <p>
                หากคุณต้องการชำระเงินผ่าน{' '}
                <strong className='text-primary-website'>
                  PromptPay QR Code
                </strong>{' '}
                ระบบจะสร้าง QR Code ชำระเงินให้คุณโดยอัตโนมัติบนหน้า Checkout
                ของ Stripe
              </p>

              <p>ขั้นตอน:</p>
              <ul className='list-disc space-y-2 pl-5'>
                <li>
                  เลือกวิธีชำระเงินเป็น{' '}
                  <strong className='text-primary-website'>
                    PromptPay (QR Code)
                  </strong>
                </li>
                <li>สแกน QR ด้วย Mobile Banking ของคุณ</li>
                <li>ชำระเงินและรอการยืนยัน (ใช้เวลาภายในไม่กี่วินาที)</li>
                <li>ระบบจะอัปเดตสถานะการสั่งซื้อให้อัตโนมัติ</li>
              </ul>

              <p className='text-default-500'>
                รองรับธนาคารไทยทุกธนาคารที่สามารถสแกน QR PromptPay
              </p>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default Payment
