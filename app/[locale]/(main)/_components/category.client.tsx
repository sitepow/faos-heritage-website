// 'use client'

// import { Card, CardHeader } from '@heroui/react'
// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-5'>
//       <Card radius='none' shadow='none' className='bg-inherit'>
//         <CardHeader className='bg-none py-5 font-semibold'>
//           <span className='text-primary mx-auto border-b-4 pb-2.5 text-xl font-bold sm:text-2xl'>
//             {tc('category')}
//           </span>
//         </CardHeader>
//       </Card>

//       <div className='flex flex-wrap justify-center gap-5'>
//         {categories?.map((category) => (
//           <div
//             key={category.id}
//             onClick={() =>
//               router.push(`/category/${createSlug(category.name, category.id)}`)
//             }
//             className='group flex w-28 cursor-pointer flex-col items-center gap-2 sm:w-32'
//           >
//             <div className='relative overflow-hidden rounded-2xl'>
//               <img
//                 src={category?.image ?? NO_IMAGE}
//                 alt={category.name}
//                 className='border-divider aspect-square size-14 w-full rounded-full border object-cover md:size-16'
//               />
//             </div>
//             <span className='group-hover:text-primary line-clamp-1 font-medium sm:text-lg'>
//               {category?.name}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { Card, CardHeader, CardBody } from '@heroui/react'
// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-8 p-4'>
//       <Card radius='none' shadow='none' className='bg-inherit'>
//         <CardHeader className='bg-none py-2 font-semibold'>
//           <div className='flex flex-col gap-1'>
//             <span className='text-primary text-2xl font-bold sm:text-3xl'>
//               {tc('category')}
//             </span>
//             <div className='bg-primary h-1 w-20 rounded-full' />{' '}
//           </div>
//         </CardHeader>
//       </Card>

//       <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
//         {categories?.map((category) => (
//           <div
//             key={category.id}
//             onClick={() =>
//               router.push(`/category/${createSlug(category.name, category.id)}`)
//             }
//             className='group cursor-pointer'
//           >
//             <Card
//               shadow='sm'
//               className='bg-content1 group-hover:ring-primary/50 border-none transition-all duration-300 group-hover:ring-2 hover:-translate-y-2 hover:shadow-lg'
//               radius='sm'
//             >
//               <CardBody className='p-0'>
//                 <div className='relative aspect-[4/5] overflow-hidden'>
//                   <img
//                     src={category?.image ?? NO_IMAGE}
//                     alt={category.name}
//                     className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
//                   />
//                   <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
//                 </div>
//               </CardBody>
//             </Card>

//             <div className='mt-3 text-center'>
//               <span className='group-hover:text-primary block truncate text-sm font-bold transition-colors sm:text-base'>
//                 {category?.name}
//               </span>
//               <p className='text-default-400 text-xs'>Explore more</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-6 p-4'>
//       <div className='border-primary flex items-center justify-between border-l-4 pl-4'>
//         <h2 className='text-2xl font-black tracking-tight uppercase sm:text-3xl'>
//           {tc('category')}
//         </h2>
//         <span className='text-default-400 hidden text-sm sm:block'>
//           ZentraCore Selection
//         </span>
//       </div>

//       <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
//         {categories?.map((category) => (
//           <div
//             key={category.id}
//             onClick={() =>
//               router.push(`/category/${createSlug(category.name, category.id)}`)
//             }
//             className='group relative cursor-pointer'
//           >
//             <div className='border-divider bg-content1/50 hover:bg-content1 group-hover:border-primary/50 flex items-center gap-4 rounded-2xl border p-3 transition-all duration-300 hover:shadow-md'>
//               <div className='bg-default-100 relative h-16 w-16 shrink-0 overflow-hidden rounded-xl'>
//                 <img
//                   src={category?.image ?? NO_IMAGE}
//                   alt={category.name}
//                   className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
//                 />
//               </div>

//               <div className='flex flex-col overflow-hidden'>
//                 <span className='group-hover:text-primary truncate text-base font-bold transition-colors'>
//                   {category?.name}
//                 </span>
//                 <span className='text-default-400 text-xs tracking-widest uppercase'>
//                   Collection
//                 </span>
//               </div>

//               <div className='ml-auto translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100'>
//                 <svg
//                   width='20'
//                   height='20'
//                   viewBox='0 0 24 24'
//                   fill='none'
//                   className='stroke-primary'
//                   strokeWidth='2.5'
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                 >
//                   <path d='M5 12h14M12 5l7 7-7 7' />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-10 p-6'>
//       <div className='flex flex-col items-center gap-2 text-center'>
//         <h2 className='text-primary text-3xl font-black tracking-tighter italic sm:text-5xl'>
//           {tc('category').toUpperCase()}
//         </h2>
//         <div className='bg-secondary h-1.5 w-12 rounded-full' />
//       </div>

//       <div className='flex flex-wrap justify-center gap-x-8 gap-y-12'>
//         {categories?.map((category) => (
//           <div
//             key={category.id}
//             onClick={() =>
//               router.push(`/category/${createSlug(category.name, category.id)}`)
//             }
//             className='group relative flex flex-col items-center'
//           >
//             <div className='group-hover:border-primary dark:border-default-100 relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl transition-all duration-500 group-hover:-translate-y-3 sm:h-32 sm:w-32'>
//               <img
//                 src={category?.image ?? NO_IMAGE}
//                 alt={category.name}
//                 className='h-[90%] w-[90%] rounded-full object-cover'
//               />

//               <div className='bg-primary absolute -top-2 -right-2 flex h-8 w-8 scale-0 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-100'>
//                 <svg
//                   width='16'
//                   height='16'
//                   fill='none'
//                   stroke='currentColor'
//                   strokeWidth='3'
//                   viewBox='0 0 24 24'
//                 >
//                   <path
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     d='M12 4.5v15m7.5-7.5h-15'
//                   />
//                 </svg>
//               </div>
//             </div>

//             <div className='bg-primary/10 group-hover:bg-primary/30 absolute bottom-8 h-16 w-16 rounded-full blur-xl transition-all duration-500 group-hover:scale-150' />

//             <div className='mt-4 flex flex-col items-center'>
//               <span className='group-hover:text-primary text-lg font-extrabold tracking-tight transition-colors'>
//                 {category?.name}
//               </span>
//               <div className='mt-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
//                 <div className='bg-primary h-1.5 w-1.5 rounded-full' />
//                 <div className='bg-primary/50 h-1.5 w-1.5 rounded-full' />
//                 <div className='bg-primary/20 h-1.5 w-1.5 rounded-full' />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-8 p-4'>
//       <div className='flex flex-col gap-1 px-2'>
//         <span className='text-default-400 text-xs font-bold tracking-[0.2em] uppercase'>
//           Our Collections
//         </span>
//         <h2 className='text-foreground text-4xl font-light tracking-tight sm:text-5xl'>
//           Shop by{' '}
//           <span className='text-primary font-bold'>{tc('category')}</span>
//         </h2>
//       </div>

//       <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
//         {categories?.map((category, index) => {
//           const isLarge = index % 5 === 0

//           return (
//             <div
//               key={category.id}
//               onClick={() =>
//                 router.push(
//                   `/category/${createSlug(category.name, category.id)}`,
//                 )
//               }
//               className={`group border-divider bg-content1 hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-[2.5rem] border p-2 transition-all duration-500 hover:shadow-2xl ${
//                 isLarge ? 'md:col-span-2 md:row-span-2' : 'col-span-1'
//               }`}
//             >
//               <div className='bg-default-50 relative h-full w-full overflow-hidden rounded-[2.2rem]'>
//                 <img
//                   src={category?.image ?? NO_IMAGE}
//                   alt={category.name}
//                   className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
//                 />

//                 <div className='absolute right-3 bottom-3 left-3 flex items-center justify-between overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-md dark:bg-black/20'>
//                   <div className='flex flex-col'>
//                     <span className='text-sm font-bold text-white drop-shadow-md sm:text-base'>
//                       {category?.name}
//                     </span>
//                     <span className='text-[10px] tracking-wider text-white/80 uppercase'>
//                       Explore Item
//                     </span>
//                   </div>

//                   <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:rotate-45'>
//                     <svg
//                       width='18'
//                       height='18'
//                       viewBox='0 0 24 24'
//                       fill='none'
//                       stroke='white'
//                       strokeWidth='2.5'
//                     >
//                       <path d='M7 17L17 7M17 7H7M17 7V17' />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-12 p-4'>
//       <div className='flex flex-col items-center gap-3'>
//         <h2 className='text-default-500 tedt-xefault-500 texmedium tracking-[upp.rcpse'>
//           Curated Selection
//         </h2>
//         <div className='flex items-center gap-4'>
//           <div className='bg-divider bg-divider h' />
//           <span className='text-3xl font-light tracking-[0.2em] sm:text-4xl'>
//             {tc('category').toUpperCase()}
//           </span>
//           <div className='bg-divider bg-divider h' />
//         </div>
//       </div>

//       <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-12'>
//         {categories?.map((category) => (
//           <div
//             key={category.id}
//             onClick={() =>
//               router.push(`/category/${createSlug(category.name, category.id)}`)
//             }
//             className='group relative cursor-pointer'
//           >
//             <div className='bg-default-100 bg-default-100 overflow-hi relative aspect-[16/9]'>
//               <img
//                 src={category?.image ?? NO_IMAGE}
//                 alt={category.name}
//                 className='h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0'
//               />

//               <div className='bg-primbry/20 ag-primary/20 lefttransition-all absolute inset-0 duration-500 group-hover:left-[100%]' />
//             </div>

//             <div className='bg-content1 dark:bg-content2 bg-content1 dark:bg-crntenl2 0 grou -mt-8 mr-6 ml-6 p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-2'>
//               <div className='flex items-end justify-between'>
//                 <div className='flex flex-col gap-1'>
//                   <div className='h-0.5 w-8 transition-all duration-500 group-hover:w-full' />
//                   <span className='group-hover:text-primary group-hover:text-primary tracki text-lg font-bold'>
//                     {category?.name}
//                   </span>
//                   <span className='text-default-400 text-default-400 tex'>
//                     View Collection
//                   </span>
//                 </div>

//                 <span className='text-4xl font-black opacity-5 transition-opacity group-hover:opacity-20'>
//                   {category.id.toString().slice(-2)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-10 p-4'>
//       <div className='relative overflow-hidden p-6'>
//         <div className='bg-primary absolute top-0 left-0 h-full w-1 shadow-[0_0_15px_rgba(var(--heroui-primary-rgb),0.5)]' />
//         <h2 className='text-foreground text-3xl font-black tracking-widest italic sm:text-5xl'>
//           {tc('category').toUpperCase()}
//         </h2>
//         <span className='text-primary font-mono text-xs tracking-tighter uppercase'>
//           // System.ZentraCore.Categories
//         </span>
//       </div>

//       <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
//         {categories?.map((category) => (
//           <div
//             key={category.id}
//             onClick={() =>
//               router.push(`/category/${createSlug(category.name, category.id)}`)
//             }
//             className='group relative cursor-pointer'
//           >
//             <div
//               className='bg-content2 group-hover:bg-primary relative aspect-square overflow-hidden p-[2px] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(var(--heroui-primary-rgb),0.3)]'
//               style={{
//                 clipPath:
//                   'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)',
//               }}
//             >
//               <div
//                 className='bg-content1 h-full w-full overflow-hidden'
//                 style={{
//                   clipPath:
//                     'polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)',
//                 }}
//               >
//                 <img
//                   src={category?.image ?? NO_IMAGE}
//                   alt={category.name}
//                   className='h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100'
//                 />
//               </div>

//               <div className='pointer-events-none absolute inset-0 animate-pulse bg-[linear-gradient(transparent_50%,rgba(var(--heroui-primary-rgb),0.1)_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100' />
//             </div>

//             <div className='mt-3 flex items-center gap-2'>
//               <div className='border-primary group-hover:bg-primary h-3 w-3 rotate-45 border-2 bg-transparent transition-all' />
//               <div className='flex flex-col'>
//                 <span className='group-hover:text-primary font-mono text-sm font-bold tracking-tight uppercase'>
//                   {category?.name}
//                 </span>
//                 <div className='bg-primary h-[1px] w-0 transition-all duration-300 group-hover:w-full' />
//               </div>
//             </div>

//             <div className='text-default-100 group-hover:text-primary/10 absolute -top-4 -right-2 -z-10 font-mono text-6xl font-black transition-all'>
//               #0{category.id.toString().slice(-1)}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-12 p-4'>
//       <div className='flex flex-col items-center gap-2'>
//         <span className='bg-primary/10 text-primary rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase'>
//           Selection
//         </span>
//         <h2 className='text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
//           {tc('category')}
//         </h2>
//       </div>

//       <div className='flex flex-wrap justify-center gap-10 md:gap-16'>
//         {categories?.map((category, index) => (
//           <div
//             key={category.id}
//             onClick={() =>
//               router.push(`/category/${createSlug(category.name, category.id)}`)
//             }
//             className='group relative cursor-pointer'
//           >
//             <div
//               className={`relative h-32 w-32 overflow-hidden shadow-inner transition-all duration-700 ease-in-out group-hover:scale-110 sm:h-40 sm:w-40 ${
//                 index % 3 === 0
//                   ? 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]'
//                   : index % 3 === 1
//                     ? 'rounded-[70%_30%_30%_70%/60%_40%_60%_40%]'
//                     : 'rounded-[50%_50%_20%_80%/25%_80%_20%_75%]'
//               } `}
//             >
//               <div className='bg-primary/20 absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

//               <img
//                 src={category?.image ?? NO_IMAGE}
//                 alt={category.name}
//                 className='h-full w-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-6'
//               />
//             </div>

//             <div className='bg-secondary/20 group-hover:bg-primary/30 absolute -right-2 -bottom-2 -z-10 h-12 w-12 rounded-full blur-xl transition-all duration-500 group-hover:scale-150' />

//             <div className='mt-6 text-center'>
//               <span className='text-foreground relative text-base font-semibold tracking-wide sm:text-lg'>
//                 {category?.name}
//                 <svg
//                   className='absolute -bottom-2 left-0 w-full opacity-0 transition-opacity group-hover:opacity-100'
//                   height='6'
//                   viewBox='0 0 100 6'
//                   fill='none'
//                 >
//                   <path
//                     d='M0 1C20 5 30 5 50 1C70 -3 80 -3 100 1'
//                     stroke='currentColor'
//                     className='text-primary'
//                     strokeWidth='2'
//                     strokeLinecap='round'
//                   />
//                 </svg>
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

import { NO_IMAGE } from '@/utils/constants/seo'
import { createSlug } from '@/utils/helpers/slug'

export const CategoryClient = () => {
  const tc = useTranslations('Common')
  const router = useRouter()
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  return (
    <div className='container mx-auto flex flex-col gap-10 p-4'>
      <div className='border-divider flex flex-wrap items-end justify-center gap-2'>
        <h2 className='text-foreground text-5xl font-black'>
          {tc('category')}
        </h2>
        <span className='primary mb-1 font-mono text-sm'>
          [ {categories?.length || 0} ]
        </span>
      </div>

      <div className='flex h-[450px] w-full flex-row gap-2 overflow-hidden sm:h-[550px]'>
        {categories?.slice(0, 6).map((category) => (
          <div
            key={category.id}
            onClick={() =>
              router.push(`/category/${createSlug(category.name, category.id)}`)
            }
            className='group relative h-full flex-[1] cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[4]'
          >
            <img
              src={category?.image ?? NO_IMAGE}
              alt={category.name}
              className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-90' />
            <div className='absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0'>
              <span className='rotate-[-90deg] text-xl font-bold tracking-[0.3em] whitespace-nowrap text-white/70 uppercase'>
                {category?.name}
              </span>
            </div>
            <div className='absolute bottom-0 left-0 flex size-full translate-y-10 items-center justify-center p-8 uppercase opacity-0 duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
              {/* <div className='flex flex-col gap-2'>
                <span className='bg-primary w-fit rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase'>
                  New Arrival
                </span>
                <h3 className='text-3xl font-black text-white sm:text-4xl'>
                  {category?.name}
                </h3>{' '}
                uppercase
                <div className='flbg-primary ex items-cenext-white/80'>
                  <span className='text-sm tracking-widest uppercase'>
                    Explore Now
                  </span>
                  <div className='bg-primary h-[1px] w-12' />
                </div>
              </div>
              border-primary */}
              <h3 className='text-3xl font-black text-white sm:text-4xl'>
                {category?.name}
              </h3>
            </div>
            <div className='border-primary absolute inset-0 rounded-2xl border-0 transition-all duration-300 group-hover:border-4' />
          </div>
        ))}
      </div>
    </div>
  )
}

// 'use client'

// import { useQuery } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import { useTranslations } from 'next-intl'

// import { getCategories } from '../../(dashboard)/dashboard/product/action/category'

// import { NO_IMAGE } from '@/utils/constants/seo'
// import { createSlug } from '@/utils/helpers/slug'

// export const CategoryClient = () => {
//   const tc = useTranslations('Common')
//   const router = useRouter()
//   const { data: categories } = useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   })

//   return (
//     <div className='container mx-auto flex flex-col gap-16 p-4 py-10'>
//       <div className='border-foreground flex flex-col border-y-4 py-6 text-center'>
//         <h2 className='text-6xl font-[900] tracking-tighter uppercase sm:text-8xl md:text-9xl'>
//           {tc('category')}
//         </h2>
//         <div className='flex justify-between px-2 font-mono text-xs font-bold uppercase sm:text-sm'>
//           <span>ZentraCore Edition 2024</span>
//           <span className='text-primary'>
//             Available Items: {categories?.length}
//           </span>
//           <span>Vol. 01 / No. 10</span>
//         </div>
//       </div>

//       <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
//         {categories?.map((category) => (
//           <div
//             key={category.id}
//             onClick={() =>
//               router.push(`/category/${createSlug(category.name, category.id)}`)
//             }
//             className='group relative cursor-pointer'
//           >
//             <div className='border-foreground relative overflow-hidden border-4 bg-white transition-all duration-300 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_0px_rgba(var(--heroui-primary-rgb),1)]'>
//               <div className='border-foreground aspect-square overflow-hidden border-b-4'>
//                 <img
//                   src={category?.image ?? NO_IMAGE}
//                   alt={category.name}
//                   className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
//                 />
//               </div>

//               <div className='flex flex-col p-4'>
//                 <div className='flex items-start justify-between gap-2'>
//                   <span className='group-hover:text-primary text-2xl leading-none font-black tracking-tighter uppercase transition-colors'>
//                     {category?.name}
//                   </span>
//                   <div className='bg-foreground group-hover:bg-primary p-1 text-white transition-colors'>
//                     <svg
//                       width='20'
//                       height='20'
//                       viewBox='0 0 24 24'
//                       fill='none'
//                       stroke='currentColor'
//                       strokeWidth='3'
//                     >
//                       <path d='M7 17L17 7M17 7H7M17 7V17' />
//                     </svg>
//                   </div>
//                 </div>

//                 <div className='border-default-300 mt-4 flex items-end justify-between border-t-2 border-dotted pt-2'>
//                   <span className='text-default-400 font-mono text-[10px] uppercase'>
//                     Zentra-ID: {category.id}
//                   </span>
//                   <div className='flex gap-1'>
//                     {[1, 2, 3, 4].map((i) => (
//                       <div
//                         key={i}
//                         className='bg-foreground group-hover:bg-primary h-3 w-1'
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className='border-default-200 absolute inset-0 -z-10 border-4 border-dashed opacity-0 transition-opacity group-hover:opacity-100' />
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }
