'use client'

import { Card, CardHeader, CardBody, Skeleton } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { getFavorites } from './action'
import { FavoriteItem } from './item'

export const FavoriteCard = () => {
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
          <div className='text-default-500 flex flex-col items-center gap-2'>
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
