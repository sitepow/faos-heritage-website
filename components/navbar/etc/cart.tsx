import { Button } from '@heroui/button'
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
    <Link href={siteConfig.link.cart}>
      <Button variant='light'>
        <ShoppingCartIcon />
        {data?.totalCarts && (
          <div className='absolute top-0 right-5 flex h-5 w-5 items-center justify-center rounded-full bg-red-800 text-xs font-bold text-white'>
            {data.totalCarts > 99 ? '99+' : data.totalCarts}
          </div>
        )}
      </Button>
    </Link>
  )
}

export { Cart }
