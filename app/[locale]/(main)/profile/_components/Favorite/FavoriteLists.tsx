// /* eslint-disable react/no-unstable-nested-components */
// 'use client'

// import { Card, CardHeader, CardBody, Skeleton } from '@heroui/react'
// import { useQuery } from '@tanstack/react-query'
// import { AlertCircleIcon } from 'lucide-react'
// import Link from 'next/link'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { FavoriteItem } from './FavoriteItem'
// import { getFavorites } from '../../../../../../features/favorite/favorite.action'

// const FavoriteCard = () => {
//   const t = useTranslations('Account')
//   const { data: session } = useSession()
//   const userId = session?.user?.id

//   const QUERY_KEY = {
//     FAVORITES: ['account', 'favorites', userId],
//   }

//   const { data: favorites, isLoading: isLoadingFaorites } = useQuery({
//     queryKey: QUERY_KEY.FAVORITES,
//     queryFn: () => getFavorites({ userId }),
//   })

//   const favoritesLength = favorites?.items?.length

//   return (
//     <Card
//       fullWidth
//       className='border-default-100 border'
//       radius='sm'
//       shadow='none'
//     >
//       <CardHeader className='font-semibold'>{t('tabs.favorites')}</CardHeader>
//       <CardBody className='gap-4'>
//         {isLoadingFaorites && <Skeleton className='h-40 w-full rounded-xl' />}

//         {!isLoadingFaorites && favoritesLength === 0 && (
//           <div className='text-default-500 flex flex-col items-center gap-2 py-10'>
//             <AlertCircleIcon size={32} />
//             <span className='text-center'>
//               {t.rich('favoritesEmpty', {
//                 br: () => <br />,
//                 link: (chunks) => (
//                   <Link
//                     className='text-primary cursor-pointer underline'
//                     href='/products'
//                   >
//                     {chunks}
//                   </Link>
//                 ),
//               })}
//             </span>
//           </div>
//         )}

//         {!isLoadingFaorites &&
//           favoritesLength !== 0 &&
//           favorites?.items?.map((favorite) => (
//             <FavoriteItem key={favorite?.id} favorite={favorite} />
//           ))}
//       </CardBody>
//     </Card>
//   )
// }

// export { FavoriteCard }
