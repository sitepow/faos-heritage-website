/* eslint-disable jsx-a11y/alt-text */
'use client'

import { Accordion, AccordionItem } from '@heroui/react'

const Payment = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <span className='text-2xl font-bold'>วิธีการชำระเงิน</span>
      <span>แสดงวิธีและช่องทางการชำระเงินที่รองรับ</span>

      <div className='mx-auto w-1/2'>
        <Accordion variant='splitted'>
          <AccordionItem
            key='1'
            aria-label='วิธีการเริ่มซื้อสินค้า'
            title='วิธีการเริ่มซื้อสินค้า'
          >
            <img src='/example-payment.jpg' />
          </AccordionItem>
          <AccordionItem
            key='2'
            aria-label='วิธีการชำระเงินด้วยบัตรเดบิต/เครดิต'
            title='วิธีการชำระเงินด้วยบัตรเดบิต/เครดิต'
          >
            <img src='/example-payment.jpg' />
          </AccordionItem>
          <AccordionItem
            key='3'
            aria-label='วิธีการชำระเงินด้วย QR Code'
            title='วิธีการชำระเงินด้วย QR Code'
          >
            <img src='/example-payment.jpg' />
          </AccordionItem>
          <AccordionItem
            key='4'
            aria-label='วิธีการชำระเงินด้วย Paypal'
            title='วิธีการชำระเงินด้วย Paypal'
          >
            <img src='/example-payment.jpg' />
          </AccordionItem>
          <AccordionItem
            key='5'
            aria-label='วิธีการชำระเงินด้วยการโอนเงิน (คำสั่งซื้อจะเสร็จสมบูรณ์ภายใน 24 ชั่วโมง)'
            title='วิธีการชำระเงินด้วยการโอนเงิน (คำสั่งซื้อจะเสร็จสมบูรณ์ภายใน 24 ชั่วโมง)'
          >
            <img src='/example-payment.jpg' />
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default Payment
