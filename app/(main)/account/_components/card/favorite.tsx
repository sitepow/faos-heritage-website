'use client'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { AlertCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { getFavorites } from '../../actions/favorite'
import { Favorite } from '../favorite'

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
      <CardHeader>
        <span>รายการโปรด</span>
      </CardHeader>
      <CardBody className='gap-4'>
        {isLoadingFaorites && <Skeleton className='h-40 w-full rounded-xl' />}

        {!isLoadingFaorites && favoritesLength === 0 && (
          <div className='flex flex-col items-center gap-2 text-default-500'>
            <AlertCircleIcon />
            <span className='text-center'>
              คุณยังไม่มีสินค้าในรายการโปรด
              <br />
              <Link className='underline' href='/products'>
                สำรวจสินค้าทั้งหมด
              </Link>
            </span>
          </div>
        )}

        {!isLoadingFaorites &&
          favoritesLength !== 0 &&
          favorites?.items?.map((favorite) => (
            <Favorite key={favorite?.id} favorite={favorite} />
          ))}
      </CardBody>
    </Card>
  )
}

export { FavoriteCard }
