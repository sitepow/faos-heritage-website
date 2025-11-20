import type { ComponentProps, FC } from 'react'

import { cn } from '@/utils/style'

const Header: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'items-center bg-primary-website px-6 py-2.5 text-white sm:text-sm lg:text-base',
        className,
      )}
      {...props}
    >
      เปิดร้านออนไลน์ได้ในไม่กี่นาที ไม่ต้องเขียนโค้ด ปลอดภัยทุกการชำระเงิน
    </div>
  )
}

export { Header }
