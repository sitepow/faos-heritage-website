'use client'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { FavoriteItem } from '@/app/(main)/_components/card/account/item/favorite'
import { getFavorites } from '@/app/(main)/actions/favorite'

const FavoriteCard = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const QUERY = {
    FAVORITES: ['account', 'favorites', userId],
  }

  const { data: favorites, isLoading: isLoadingFaorites } = useQuery({
    queryKey: QUERY.FAVORITES,
    queryFn: () => getFavorites({ userId }),
  })

  const favoritesLength = favorites?.items?.length

  return (
    <Card fullWidth>
      <CardHeader>Favorites</CardHeader>
      <CardBody className='gap-4'>
        {isLoadingFaorites && <Skeleton className='h-40 w-full rounded-xl' />}

        {!isLoadingFaorites && favoritesLength === 0 && (
          <div className='flex flex-col items-center gap-2 text-default-500'>
            <AlertCircleIcon />
            <span className='text-center'>
              You don&apos;t have any items in your favorites list yet.
              <br />
              <Link className='underline' href='/products'>
                Explore all products.
              </Link>
            </span>
          </div>
        )}

        {!isLoadingFaorites &&
          favoritesLength !== 0 &&
          favorites?.items?.map((favorite) => (
            <FavoriteItem key={favorite?.id} favorite={favorite} />
          ))}
      </CardBody>
    </Card>
  )
}

export { FavoriteCard }
