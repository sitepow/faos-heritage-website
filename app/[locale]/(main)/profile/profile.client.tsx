// 'use client'

// import { Tab, Tabs } from '@heroui/react'
// import Head from 'next/head'
// import { useTranslations } from 'next-intl'
// import { useEffect, useState } from 'react'

// import type { Key } from 'react'

// import { AddressCard } from './_components/Address/AddressCard'
// import { FavoriteCard } from './_components/Favorite/FavoriteLists'
// import { OrderCard } from './_components/Order/OrderLists'
// import { OverviewCard } from './_components/Overview'
// import { ProfileCard } from './_components/ProfileForm'

// import { PROFILE_TABS } from '@/constants'
// import { BREAKPOINTS } from '@/constants'
// import { useIsBelowBreakpoint } from '@/hooks/useIsBelowBreakpoint'
// import { useIsMounted } from '@/hooks/useIsMounted'
// import { useUrlQuery } from '@/hooks/useUrlQuery'
// import { useUser } from '@/hooks/useUser'

// const ProfileClient = () => {
//   const t = useTranslations('profile')
//   const isTabletOrMobile = useIsBelowBreakpoint(BREAKPOINTS.TABLET)
//   const mounted = useIsMounted()

//   const { user } = useUser()
//   const { setQueryParam, getQueryParam } = useUrlQuery()

//   const tabParam = getQueryParam('tab') as PROFILE_TABS | null
//   const [selectedTabKey, setSelectedTabKey] = useState<PROFILE_TABS>(
//     tabParam ?? PROFILE_TABS.ACCOUNT,
//   )

//   useEffect(() => {
//     if (tabParam && tabParam !== selectedTabKey) {
//       setSelectedTabKey(tabParam)
//     }
//   }, [selectedTabKey, tabParam])

//   const handleTabChange = (key: Key) => {
//     const tab = key as PROFILE_TABS

//     setSelectedTabKey(tab)
//     setQueryParam('tab', tab)
//   }

//   return (
//     <>
//       <Head>
//         <meta content='noindex, nofollow' name='robots' />
//       </Head>

//       <section className='container mx-auto flex flex-col items-center justify-center gap-4 p-5 text-center'>
//         <div className='w-full text-start'>
//           <span className='text-xl font-semibold'>
//             {t('welcome', { name: user?.name! })}
//           </span>
//         </div>

//         <div className='w-full'>
//           {mounted && (
//             <Tabs
//               aria-label='Options'
//               className='h-full rounded-lg bg-white dark:bg-inherit'
//               classNames={{
//                 base: 'w-full flex flex-col lg:flex-row lg:w-fit',
//                 tabList: 'flex overflow-x-auto lg:flex-col lg:w-fit gap-1 p-2',
//                 panel: `w-full`,
//               }}
//               isVertical={isTabletOrMobile ? true : false}
//               selectedKey={selectedTabKey}
//               variant='bordered'
//               onSelectionChange={handleTabChange}
//             >
//               <Tab key={PROFILE_TABS.ACCOUNT} title={t('tabs.manage')}>
//                 <OverviewCard
//                   onclickAddress={() => handleTabChange(PROFILE_TABS.ADDRESS)}
//                   onclickProfile={() => handleTabChange(PROFILE_TABS.PROFILE)}
//                 />
//               </Tab>
//               <Tab key={PROFILE_TABS.ORDER} title={t('tabs.orders')}>
//                 <OrderCard />
//               </Tab>
//               <Tab key={PROFILE_TABS.FAVORITE} title={t('tabs.favorites')}>
//                 <FavoriteCard />
//               </Tab>
//               <Tab key={PROFILE_TABS.PROFILE} title={t('tabs.editProfile')}>
//                 <ProfileCard />
//               </Tab>
//               <Tab key={PROFILE_TABS.ADDRESS} title={t('tabs.address')}>
//                 <AddressCard />
//               </Tab>
//             </Tabs>
//           )}
//         </div>
//       </section>
//     </>
//   )
// }

// export { ProfileClient }
