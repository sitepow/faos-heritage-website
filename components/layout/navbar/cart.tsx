import { useQuery } from '@tanstack/react-query'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { getCartStat } from '@/app/(main)/cart/action'
import { siteConfig } from '@/config/site'

export const NavbarCart = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data } = useQuery({
    queryKey: ['carts', 'stat', userId],
    queryFn: () => getCartStat(userId!),
    enabled: !!userId,
  })

  const cartCount = data?.totalCarts ?? 0
  const hasItems = cartCount > 0
  const displayCount = cartCount > 99 ? '99+' : cartCount

  return (
    <Link className='relative inline-block' href={siteConfig.link.cart}>
      <ShoppingCartIcon className='text-default-400' />
      {hasItems && (
        <div className='bg-primary text-secondary absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full text-xs font-bold'>
          {displayCount}
        </div>
      )}
    </Link>
  )
}
