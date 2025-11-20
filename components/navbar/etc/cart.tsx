import { Button } from '@heroui/button'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'

import type { FC } from 'react'

import { siteConfig } from '@/config/site'

interface Props {
  count: number
}

const Cart: FC<Props> = ({ count }) => {
  return (
    <Link href={siteConfig.link.cart}>
      <Button
        endContent={
          count > 0 && (
            <div className='flex size-7 items-center justify-center rounded-full bg-red-800 text-xs font-bold text-white'>
              <span>{count && count > 99 ? '99+' : count}</span>
            </div>
          )
        }
        startContent={<ShoppingCartIcon />}
        variant='light'
      />
    </Link>
  )
}

export { Cart }
