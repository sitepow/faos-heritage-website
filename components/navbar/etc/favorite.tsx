import { useQuery } from '@tanstack/react-query'
import { HeartIcon } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { getDashboard } from '@/app/(main)/account/actions/favorite'
import { ACCOUNT_TABS } from '@/utils/const'

const Favorite = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const { data } = useQuery({
    queryKey: ['favorites', 'count', userId],
    queryFn: () => getDashboard(userId!),
    enabled: !!userId,
  })

  return (
    <Link
      className='relative inline-block'
      href={`/account?tab=${ACCOUNT_TABS.FAVORITE}`}
    >
      <HeartIcon className='size-6 text-default-500' />
      {!!data?.totalFavorites && (
        <div className='absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-red-800 text-xs font-bold text-white'>
          {data.totalFavorites > 99 ? '99+' : data.totalFavorites}
        </div>
      )}
    </Link>
  )
}

export { Favorite }
