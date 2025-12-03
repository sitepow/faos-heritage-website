'use client'

import { getCarts } from '@/app/(main)/cart/actions/cart'
import { useCartStore } from '@/app/(main)/cart/store'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import type { FC, PropsWithChildren } from 'react'
import { useEffect } from 'react'

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const { setState } = useCartStore()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data, isLoading } = useQuery({
    queryKey: ['carts', userId],
    queryFn: () => getCarts(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (data) {
      setState({ carts: data, isLoading })
    } else {
      setState({ isLoading })
    }
  }, [data, isLoading, setState])

  return children
}
