import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'

import { getDashboard } from '@/app/(main)/cart/actions/cart'
import { siteConfig } from '@/config/site'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

const Cart = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data } = useQuery({
    queryKey: ['carts', 'count', userId],
    queryFn: () => getDashboard(userId!),
    enabled: !!userId,
  })

  return (
    <Link href={siteConfig.link.cart} className='relative inline-block'>
      <ShoppingCartIcon className='size-6' />
      {!!data?.totalCarts && (
        <div className='absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-800 text-xs font-bold text-white'>
          {data.totalCarts > 99 ? '99+' : data.totalCarts}
        </div>
      )}
    </Link>
  )
}

export { Cart }
