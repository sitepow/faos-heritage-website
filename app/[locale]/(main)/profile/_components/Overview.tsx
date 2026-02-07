// 'use client'

// import { Card, CardHeader, CardBody, Skeleton, Button } from '@heroui/react'
// import { Role } from '@prisma/client'
// import { useQuery } from '@tanstack/react-query'
// import { useSession } from 'next-auth/react'
// import { useTranslations } from 'next-intl'

// import { getUser } from '@/features/user/user.action'

// interface Props {
//   onclickProfile?: () => void
//   onclickAddress?: () => void
// }

// const OverviewCard = ({ onclickProfile, onclickAddress }: Props) => {
//   const t = useTranslations('Account')
//   const { data: session } = useSession()
//   const userId = session?.user?.id

//   const QUERY_KEY = {
//     ACCOUNT: ['account', 'user', userId],
//   }

//   const { data: user, isLoading: isLoadingUser } = useQuery({
//     queryKey: QUERY_KEY.ACCOUNT,
//     queryFn: () => getUser(userId!),
//     enabled: !!userId,
//   })

//   return (
//     <Card
//       fullWidth
//       className='border-default-100 border'
//       radius='sm'
//       shadow='none'
//     >
//       <CardHeader>
//         <span className='font-semibold'>{t('tabs.manage')}</span>
//       </CardHeader>
//       <CardBody>
//         {isLoadingUser && <Skeleton className='h-40 rounded-lg sm:max-w-1/2' />}

//         {!isLoadingUser && (
//           <div className='flex flex-col sm:max-w-1/2'>
//             <div className='border-default-100 bg-primary rounded-t-lg border p-2.5 text-white'>
//               <span className='font-semibold'>{t('personalInfo')}</span>
//             </div>

//             <div className='border-default-100 rounded-b-lg border-x border-b p-2.5 *:flex *:gap-3'>
//               <span>
//                 {t('fields.name')} : {user?.name ?? '-'}
//               </span>

//               <span>
//                 {t('fields.email')} : {user?.email ?? '-'}
//               </span>

//               <span>
//                 {t('fields.role')} :{' '}
//                 {user?.role === Role.ADMIN
//                   ? t('roles.admin')
//                   : t('roles.customer')}
//               </span>

//               <div className='mt-5 flex flex-wrap'>
//                 <Button
//                   color='primary'
//                   variant='bordered'
//                   onPress={onclickProfile}
//                 >
//                   {t('tabs.editProfile')}
//                 </Button>
//                 <Button
//                   color='primary'
//                   variant='bordered'
//                   onPress={onclickAddress}
//                 >
//                   {t('tabs.editAddress')}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </CardBody>
//     </Card>
//   )
// }

// export { OverviewCard }
