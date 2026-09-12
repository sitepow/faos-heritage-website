'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { buttonVariants } from '@/components/ui/button'
import { useCartStat } from '@/features/cart/hooks/useCart'
import { cn } from '@/utils'

interface NavbarCartIndicatorProps {
  className?: string
}

const NavbarCartIndicator = ({ className }: NavbarCartIndicatorProps) => {
  const session = useSession()
  const userId = session?.data?.user?.id

  const { data: cartStat } = useCartStat({ userId })

  const cartCount = cartStat?.totalCarts ?? 0
  let displayCount: string | number | null = null
  if (cartCount > 99) {
    displayCount = '99+'
  } else if (cartCount > 0) {
    displayCount = cartCount
  }

  return (
    <Link
      aria-label='Shopping Cart'
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'icon' }),
        'relative h-9 w-9 rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-[#ba8c25] dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-[#f59e0b]',
        className,
      )}
      href='/cart'
    >
      <ShoppingBag className='h-[18px] w-[18px]' />
      {displayCount !== null && (
        <span className='animate-in zoom-in-75 absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ba8c25] px-1 text-[10px] font-bold text-white shadow-xs dark:bg-[#f59e0b] dark:text-neutral-950'>
          {displayCount}
        </span>
      )}
    </Link>
  )
}

export { NavbarCartIndicator }
