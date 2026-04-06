/* eslint-disable react/no-array-index-key */
import { ArrowUpRightIcon } from 'lucide-react'
import Link from 'next/link'

import { SectionHeader } from '../ui/SectionHeader'

interface FaqItemProps {
  title: string
  link: string
}

const faqLists = [
  {
    title: 'วิธีการเข้าสู่ระบบ/สมัครสมาชิกในเว็บไซต์',
    link: '/',
  },
  {
    title: 'วิธีการสั่งซื้อสินค้าออนไลน์',
    link: '/',
  },
  {
    title: 'วิธีการใช้งานระบบ POS (สำหรับพาร์ทเนอร์)',
    link: '/',
  },
  {
    title:
      'วิธีการสมัครใช้งานระบบ Affiliate สร้างรายได้ออนไลน์จากการแชร์ลิงค์สินค้า',
    link: '/',
  },
  {
    title: 'วิธีการชำระเงินออนไลน์/ช่องทางการชำระเงิน',
    link: '/',
  },
  {
    title: 'วิธีการจัดการหมวดหมู่สินค้า/หมวดหมู่บทความในระบบ (สำหรับ Admin)',
    link: '/',
  },
  {
    title: 'วิธีการลงสินค้าในระบบ (สำหรับ Admin)',
    link: '/',
  },
  {
    title: 'วิธีการลงบทความในระบบ (สำหรับ Admin)',
    link: '/',
  },
  {
    title: 'วิธีการจัดการสต็อกและจุดจำหน่ายสินค้าในระบบ (สำหรับ Admin)',
    link: '/',
  },
  {
    title: 'นโยบายความเป็นส่วนตัว/ข้อกำหนดการใช้งาน',
    link: '/',
  },
] as FaqItemProps[]

const FaqItem = ({ title, link }: FaqItemProps) => {
  return (
    <div className='flex w-full flex-wrap justify-between lg:w-1/2'>
      <span className='cursor-pointer text-lg tracking-tight opacity-70 hover:opacity-100 sm:text-xl'>
        {title}
      </span>

      <Link href={link!}>
        <ArrowUpRightIcon />
      </Link>
    </div>
  )
}

const FaqSection = () => {
  return (
    <section className='flex flex-col gap-5'>
      <SectionHeader title='ช่วยเหลือ?' />

      <div className='flex flex-col items-center gap-2.5'>
        {faqLists?.map((faq, idx) => {
          return <FaqItem key={idx} link={faq?.link} title={faq?.title} />
        })}
      </div>
    </section>
  )
}

export { FaqSection }
