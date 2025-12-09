import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

const Header: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn('bg-primary-website px-6 py-2.5 text-white', className)}
      {...props}
    >
      เปิดร้านออนไลน์ได้ในไม่กี่นาที ไม่ต้องเขียนโค้ด ปลอดภัยทุกการชำระเงิน
      (ทดลองใช้ฟรี 14 วัน)
    </div>
  )
}

export { Header }
