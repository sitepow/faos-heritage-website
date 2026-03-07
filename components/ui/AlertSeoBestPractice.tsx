'use client'

import { Alert } from '@heroui/react'
import { SearchIcon } from 'lucide-react'

const AlertSeoBestPractice = () => {
  return (
    <Alert
      description={
        <div className='mt-1 flex flex-col gap-2 text-sm'>
          <p>
            • <strong>Meta Title & Keywords:</strong>{' '}
            เน้นคำที่เป็นชื่อสินค้าและแบรนด์ ไม่ต้องยาวเกินไป (แนะนำ 50-60
            ตัวอักษร)
          </p>
          <p>
            • <strong>Meta Description:</strong> เขียนเน้นการขายให้กระชับ
            สำคัญที่สุดคือความยาวควรอยู่ที่ <strong>120-150 ตัวอักษร</strong>{' '}
            เพื่อให้แสดงผลบน Google ได้ครบถ้วนและจูงใจให้คนคลิก
          </p>
          <p>
            • <strong>รูปภาพปก (Cover Image):</strong>{' '}
            ระบบจะดึงรูปที่ตั้งเป็นรูปหลักไปใช้เป็น Link Preview เวลาแชร์ลง
            Social Media กรุณาตรวจสอบรูปภาพให้สวยงามและเห็นสินค้าชัดเจน
          </p>
        </div>
      }
      icon={<SearchIcon />}
      title='คำแนะนำการเพิ่มข้อมูลเพื่อประสิทธิภาพ SEO'
    />
  )
}

export { AlertSeoBestPractice }
