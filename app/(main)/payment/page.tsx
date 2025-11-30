'use client'

import { Accordion, AccordionItem } from '@heroui/accordion'
import Image from 'next/image'

import { Header } from '../_components/section/header'

const ImagePlaceholder = () => {
  return (
    <Image
      alt='product-image'
      className='size-full'
      height={250}
      src='/placeholder.svg'
      width={250}
    />
  )
}

const Payment = () => {
  return (
    <section className='flex flex-col items-center justify-center gap-4 text-center'>
      <Header description='แสดงวิธีและช่องทางการชำระเงินที่รองรับ' title='วิธีการชำระเงิน' />

      <div className='mx-auto lg:w-1/2'>
        <Accordion variant='splitted'>
          <AccordionItem key='1' aria-label='วิธีการเริ่มซื้อสินค้า' title='วิธีการเริ่มซื้อสินค้า'>
            <ImagePlaceholder />
          </AccordionItem>
          <AccordionItem
            key='2'
            aria-label='วิธีการชำระเงินด้วยบัตรเดบิต/เครดิต'
            title='วิธีการชำระเงินด้วยบัตรเดบิต/เครดิต'
          >
            <ImagePlaceholder />
          </AccordionItem>
          <AccordionItem
            key='3'
            aria-label='วิธีการชำระเงินด้วย QR Code'
            title='วิธีการชำระเงินด้วย QR Code'
          >
            <ImagePlaceholder />
          </AccordionItem>
          <AccordionItem
            key='4'
            aria-label='วิธีการชำระเงินด้วย Paypal'
            title='วิธีการชำระเงินด้วย Paypal'
          >
            <ImagePlaceholder />
          </AccordionItem>
          <AccordionItem
            key='5'
            aria-label='วิธีการชำระเงินด้วยการโอนเงิน (คำสั่งซื้อจะเสร็จสมบูรณ์ภายใน 24 ชั่วโมง)'
            title='วิธีการชำระเงินด้วยการโอนเงิน (คำสั่งซื้อจะเสร็จสมบูรณ์ภายใน 24 ชั่วโมง)'
          >
            <ImagePlaceholder />
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}

export default Payment
