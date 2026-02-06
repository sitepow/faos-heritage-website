/* eslint-disable no-nested-ternary */
import { Badge, Button } from '@heroui/react'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { useCartStat } from '@/features/cart/useCart'

const NavbarCartIndicator = () => {
  const userId = useSession()?.data?.user?.id

  const { data: cartStat } = useCartStat({ userId })

  const cartCount = cartStat?.totalCarts ?? 0
  const displayCount = cartCount > 99 ? '99+' : cartCount > 0 ? cartCount : null

  return (
    <Link aria-label='Cart' className='relative inline-block' href={'/cart'}>
      <Badge
        className='bg-primary border-none font-bold text-white'
        color='primary'
        content={displayCount}
        shape='circle'
      >
        <Button isIconOnly radius='full' variant='light'>
          <ShoppingCartIcon />
        </Button>
      </Badge>
    </Link>
  )
}

export { NavbarCartIndicator }
