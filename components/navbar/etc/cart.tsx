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
      <Button
        endContent={
          data?.totalCarts && (
            <div className='flex size-7 items-center justify-center rounded-full bg-red-800 text-xs font-bold text-white'>
              <span>{data?.totalCarts && data?.totalCarts > 99 ? '99+' : data?.totalCarts}</span>
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
