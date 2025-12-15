import { useQuery } from '@tanstack/react-query'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { getDashboard } from '@/app/(main)/cart/actions/cart'
import { siteConfig } from '@/config/site'

const Cart = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
    CART_COUNT: ['carts', 'count', userId],
  }

  const { data } = useQuery({
    queryKey: QUERY.CART_COUNT,
    queryFn: () => getDashboard(userId!),
    enabled: !!userId,
  })

  return (
    <Link className='relative inline-block' href={siteConfig.link.cart}>
      <ShoppingCartIcon className='size-6 text-default-500' />
      {!!data?.totalCarts && (
        <div className='absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary-website text-xs font-bold text-white'>
          {data.totalCarts > 99 ? '99+' : data.totalCarts}
        </div>
      )}
    </Link>
  )
}

export { Cart }
