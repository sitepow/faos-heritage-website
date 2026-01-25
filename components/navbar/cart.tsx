import { Badge, Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { getCartStat } from '@/app/[locale]/(main)/cart/action'
import { siteConfig } from '@/config/site'

export const NavbarCart = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data } = useQuery({
    queryKey: ['carts', 'stat', userId],
    queryFn: () => getCartStat(userId!),
    enabled: !!userId,
  })

  const cartCount = data?.totalCarts ?? 0
  const displayCount = cartCount > 99 ? '99+' : cartCount

  return (
    <Link className='relative inline-block' href={siteConfig.link.cart}>
      <Badge
        color='primary'
        content={displayCount === 0 ? null : displayCount}
        className='bg-primary border-none font-bold text-white'
        shape='circle'
      >
        <Button
          isIconOnly
          variant='light'
          radius='full'
          className='text-default-600 transition-all hover:scale-110'
          onClick={() => router.push('/cart')}
        >
          <ShoppingCartIcon strokeWidth={1.5} />
        </Button>
      </Badge>
    </Link>
  )
}
