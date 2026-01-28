/* eslint-disable no-nested-ternary */
import { Badge, Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { getCartStat } from '@/app/[locale]/(main)/cart/action'

const NavbarCartIndicator = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data } = useQuery({
    queryKey: ['carts', 'stat', userId],
    queryFn: () => getCartStat(userId as string),
    enabled: !!userId,
  })

  const cartCount = data?.totalCarts ?? 0
  const displayCount = cartCount > 99 ? '99+' : cartCount > 0 ? cartCount : null

  return (
    <Link aria-label='Cart' className='relative inline-block' href={'/cart'}>
      <Badge
        className='bg-primary border-none font-bold text-white'
        color='primary'
        content={displayCount}
        shape='circle'
      >
        <Button
          isIconOnly
          className='text-default-600 transition-transform hover:scale-110'
          radius='full'
          variant='light'
        >
          <ShoppingCartIcon />
        </Button>
      </Badge>
    </Link>
  )
}

export { NavbarCartIndicator }
