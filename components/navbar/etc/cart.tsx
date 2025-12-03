import { Button } from '@heroui/button'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'

import { useCartStore } from '@/app/(main)/cart/store'
import { siteConfig } from '@/config/site'

const Cart = () => {
  const { carts } = useCartStore()
  const count = carts?.length

  return (
    <Link href={siteConfig.link.cart}>
      <Button
        endContent={
          count !== 0 && (
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
